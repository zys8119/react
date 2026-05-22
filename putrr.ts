import express from "express";
import dayjs from "dayjs";
import { runChat } from "./chatgpt";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.method, req.url, Date.now());
  next();
});
let result = "";
app.use(/\/v1\/messages/, async (req, res) => {
  // 设置 SSE 必要的响应头
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  res.flushHeaders(); // 强制发送头部，开始 SSE

  // 客户端关闭连接时清理定时器
  req.on("close", () => {
    console.log("客户端断开连接");
  });
  await runChat(req.query?.text || req.body?.text || "你好", (type, data) => {
    res.write(getSseData(type, data));
    if (type === "done") {
      res.end();
    }
  });
});
const getSseData = (type: any, data: any) =>
  `event: ${type}\ndata: ${JSON.stringify({ text: data })}\n\n`;
const getMessage = (result: string) => {
  return {
    id: Buffer.from(Date.now().toString()).toString("base64"),
    container: {
      id: "id",
      expires_at: dayjs().toDate(),
    },
    content: [
      {
        citations: [
          {
            cited_text: "cited_text",
            document_index: 0,
            document_title: "document_title",
            end_char_index: 0,
            file_id: "file_id",
            start_char_index: 0,
            type: "char_location",
          },
        ],
        text: result,
        type: "text",
      },
    ],
    model: "claude-opus-4-6",
    role: "assistant",
    stop_details: {
      category: "cyber",
      explanation: "explanation",
      type: "refusal",
    },
    stop_reason: "end_turn",
    stop_sequence: null,
    type: "message",
    usage: {
      cache_creation: {
        ephemeral_1h_input_tokens: 0,
        ephemeral_5m_input_tokens: 0,
      },
      cache_creation_input_tokens: 2051,
      cache_read_input_tokens: 2051,
      inference_geo: "inference_geo",
      input_tokens: 2095,
      output_tokens: 503,
      server_tool_use: {
        web_fetch_requests: 2,
        web_search_requests: 0,
      },
      service_tier: "standard",
    },
  };
};

app.listen(8001, () => {
  console.log("Server is running on port 8001");
});
