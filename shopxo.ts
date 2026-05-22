import { createConnection } from "mysql2/promise";
let sql: Awaited<ReturnType<typeof createConnection>>;
Promise.resolve()
  .then(async () => {
    sql = await createConnection({
      host: "192.168.110.140",
      user: "root",
      password: "Zj123456,,",
      database: "shopxo",
    });
    const [rows]: any = await sql.query(/* sql */ `
    SELECT DISTINCT
    FROM_UNIXTIME(
        o.pay_time,
        '%Y-%m-%d %H:%i:%s'
    ) AS formatted_time,
    od.title,
    o.pay_time,
    o.order_no,
    o.*
FROM (
        select *
        from sxo_order
        WHERE
            pay_time < UNIX_TIMESTAMP('2026-04-09 23:59:59')
            AND status = '2'
            AND pay_status = '1'
            AND is_delete_time = '0'
            AND user_is_delete_time = '0'
    ) as o
    LEFT JOIN sxo_order_detail as od on o.id = od.order_id
WHERE
    title LIKE '%墨水屏维修%'
        `);
    console.log(
      await Promise.allSettled(
        rows.map(async ({ id, user_id }: any) => {
          return await fetch(
            "http://localhost:8000/admin.php?s=order/delivery/system_type/default.html",
            {
              headers: {
                accept: "application/json, text/javascript, */*; q=0.01",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                "content-type":
                  "multipart/form-data; boundary=----WebKitFormBoundaryees8ExBsb9BHCo65",
                "sec-ch-ua":
                  '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"macOS"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                cookie:
                  "uuid=9def68f0-67d2-7ffb-3c44-2b00eda91f40; PHPSESSID=fad2511674b3df7e0528041640fa4219",
                Referer:
                  "http://localhost:8000/admin.php?s=order/index.html&page=2&page_size=30&f0p=%E5%A2%A8%E6%B0%B4%E5%B1%8F%E7%BB%B4%E4%BF%AE&f3p=1",
              },
              body: `------WebKitFormBoundaryees8ExBsb9BHCo65\r\nContent-Disposition: form-data; name=\"express_number\"\r\n\r\nqweqw\r\n------WebKitFormBoundaryees8ExBsb9BHCo65\r\nContent-Disposition: form-data; name=\"id\"\r\n\r\n${id}\r\n------WebKitFormBoundaryees8ExBsb9BHCo65\r\nContent-Disposition: form-data; name=\"express_id\"\r\n\r\n13\r\n------WebKitFormBoundaryees8ExBsb9BHCo65\r\nContent-Disposition: form-data; name=\"user_id\"\r\n\r\n${user_id}\r\n------WebKitFormBoundaryees8ExBsb9BHCo65--\r\n`,
              method: "POST",
            },
          )
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
            });
        }),
      ),
    );
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(async () => {
    await sql.end();
  });
