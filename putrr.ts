import express from "express";
import dayjs from "dayjs";
import { runChat } from "./chatgpt";
// (async () => {
//   await runChat("js去重复");
// })();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(/\/v1\/messages/, async (req, res) => {
  console.log(req.method, req.url, Date.now());
  // await runChat("你好");
  res.json(getMessage(""));
  // const content = req.body.messages.pop().content;
  // const queryMessages = (
  //   typeof content === "string" ? [{ text: content }] : content
  // )
  //   .map((e: any) => e.text)
  //   .join("\n\n");
  // //.replace('[SUGGESTION MODE: Suggest what the user might naturally type next into Claude Code.]');
  // try {
  //   res.json(getMessage((await runChat(queryMessages)) as string));
  // } catch (err) {
  //   res.json(getMessage(""));
  // }
});
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
// app.get("/", (req, res) => {
//   // 设置 SSE 必要的响应头
//   res.set({
//     "Content-Type": "text/event-stream",
//     "Cache-Control": "no-cache",
//     Connection: "keep-alive",
//     "Access-Control-Allow-Origin": "*",
//   });

//   res.flushHeaders(); // 强制发送头部，开始 SSE

//   let count = 0;

//   // 每秒发送一条消息
//   const interval = setInterval(() => {
//     count++;
//     const data = { msg: `消息 ${count}`, timestamp: Date.now() };
//     res.write(`data: ${JSON.stringify(data)}\n\n`);
//   }, 1000);

//   // 客户端关闭连接时清理定时器
//   req.on("close", () => {
//     clearInterval(interval);
//     console.log("客户端断开连接");
//   });
// });

app.listen(8001, () => {
  console.log("Server is running on port 8001");
});
