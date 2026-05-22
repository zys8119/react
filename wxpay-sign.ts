import crypto from "crypto";
import fs from "fs";
import config from "./config.json";
import { WechatPay } from "wechat-pay-nodejs";
Promise.resolve()
  .then(async () => {
    const wechatPay = new WechatPay({
      appid: config.appid, // 应用ID
      mchid: config.mch_id, // 直连商户号
      cert_private_content: Buffer.from(config.apiclient_key), // 商户API私钥内容
      cert_public_content: Buffer.from(config.apiclient_cert), // 商户API证书内容
    });
    const result = await wechatPay.queryOrderById("12225454546546");
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
