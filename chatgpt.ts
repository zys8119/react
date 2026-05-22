// import puppeteer from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
let _browser = null as unknown as Awaited<ReturnType<typeof puppeteer.launch>>;
let isConnect = false;
let isChating = false;
export async function runChat(message: string) {
  if (!isConnect) {
    _browser = await puppeteer.connect({
      browserURL: "http://127.0.0.1:9222",
      defaultViewport: {
        width: 0,
        height: 0,
      },
    });
    _browser.once("error", async () => {
      isConnect = false;
      await _browser.disconnect();
    });
    isConnect = true;
  }

  return Promise.resolve()
    .then(async () => {
      return new Promise(async (r, j) => {
        await (async function name(params: type) {
          if (isChating) {
          }
        })();

        const pages = await _browser.pages();
        const page = (await pages[0]) || (await _browser.newPage());
        // 页面里可调用 window.sendToNode()
        const isSendToNodeExposed = await page.evaluate(() => {
          return !!window.isSendToNodeExposed;
        });
        let content = "";
        await page.exposeFunction("sendToNode", async (data: any) => {
          switch (data.type) {
            case "start":
              if (data.data === "[START]") {
                console.log("start");
                content = "";
              }
              break;
            case "done":
              if (data.data === "[DONE]") {
                console.log("done");
                await _browser.disconnect();
                r(content);
              }
              break;
            case "other":
              // if (data.data === "[DONE]") {
              //   console.log("done");
              // }
              break;
            default:
              if (typeof data.v === "string") {
                console.log(data.v);
                content += data.v;
              } else if (data.o === "patch" && Array.isArray(data.v)) {
                const v = data.v
                  .filter(
                    (e: any, index: number) =>
                      typeof e.v === "string" && e.o === "append",
                  )
                  .map((item: any) => item.v)
                  .join("\n");
                console.log(v);
                content += v;
              }
              break;
          }
        });
        if (!isSendToNodeExposed) {
          await page.evaluate(() => {
            const originalFetch = window.fetch;

            window.fetch = async (...args) => {
              const response = await originalFetch(...args);

              const url = args[0];

              if (typeof url === "string" && url.includes("/conversation")) {
                const cloned = response.clone() as any;

                const reader = cloned.body.getReader();
                const decoder = new TextDecoder();

                (async () => {
                  window.sendToNode({
                    type: "start",
                    data: "[START]",
                  });
                  while (true) {
                    const { done, value } = await reader.read();

                    if (done) break;
                    const sse = decoder.decode(value);
                    const lines = sse.split("\n");

                    for (const line of lines) {
                      if (line.startsWith("data:")) {
                        const jsonText = line.slice(5).trim();

                        try {
                          const obj = JSON.parse(jsonText);
                          window.sendToNode(obj);
                        } catch (err) {
                          window.sendToNode({
                            type: "other",
                            data: jsonText,
                          });
                          // console.error("json parse error", err);
                        }
                      }
                    }
                  }
                  window.sendToNode({
                    type: "done",
                    data: "[DONE]",
                  });
                })();
              }

              return response;
            };
          });
          await page.evaluate(() => {
            window.isSendToNodeExposed = true;
          });
        }
        const waitForSelector = async (
          selector: string,
          hasContent?: boolean,
        ) => {
          return await page.evaluate(
            async function name(selector, hasContent) {
              const el: any = document.querySelector(
                selector,
              ) as HTMLDivElement;
              if (!el || (hasContent && !el.innerText.trim())) {
                return await new Promise((r) => {
                  requestAnimationFrame(async () => {
                    await name(selector, hasContent);
                    r(true);
                  });
                });
              }
            },
            selector,
            hasContent,
          );
        };
        await waitForSelector("#prompt-textarea");
        await page.click("#prompt-textarea", {
          clickCount: 3,
        });

        await page.keyboard.press("Backspace");

        await page.type("#prompt-textarea", message);
        await page.click("#composer-submit-button");
      });
    })
    .catch(console.error)
    .finally(async () => {
      // await _browser.close();
    });
}
