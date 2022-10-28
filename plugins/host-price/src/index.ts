import { Context, Schema } from "koishi";
import { getHistroyPrice, getTodayPrice } from "./tools";
export const name = "host-price";

export interface Config {}

export const Config: Schema<Config> = Schema.object({});
function historyFormat(data) {
  const res = data.map((item) => {
    return `时间：${item.date} 价格：${item.price}¥`;
  });
  return res.join("\r\n");
}
export function apply(ctx: Context) {
  // write your plugin here
  ctx.middleware(async (session, next) => {
    if (session.content == "今日域名价格") {
      return `${await getTodayPrice()}`;
    } else if (session.content == "历史域名价格") {
      const data = await getHistroyPrice();
      return `${historyFormat(data)}`;
    }
    return next();
  });
}
