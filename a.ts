import axios from "axios";
import config from "./config.json";
import { signRequest, buildAuthorization } from "./wxpay-sign";
Promise.resolve()
  .then(async () => {
    const Authorization = "XEFfgZBtDMCASnJq3RNXY";
    const res = await axios({
      baseURL: "https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no",
      url: "/20260311210153091094",
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization,
      },
      params: {
        mchid: "1667576337",
      },
    });
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err?.response?.data ?? err.message);
  });
