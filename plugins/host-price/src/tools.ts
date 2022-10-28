import axios from "axios";
import jp from "jsonpath";
import fs from "fs";
const url =
  "https://qcwss.cloud.tencent.com/domain/ajax/newdomain?action=DescribePriceList&from=domain_buy&_format=json";

async function readFile() {
  try {
    const data = await fs.readFileSync("./data.json");
    const dataObj = JSON.parse(data);
    return dataObj;
  } catch (e) {
    return [];
  }
}

async function saveFile(data = []) {
  const content = JSON.stringify(data);
  const opt = {
    flag: "w", // a：追加写入；w：覆盖写入
  };
  await fs.writeFileSync("./data.json", content, opt);
}

async function getPriceResult() {
  const result = await axios.post(url);
  return result.data;
}
async function saveEveryDayPrice() {
  const priceNum = await getTodayPrice();
  const oldData = await readFile();
  await saveFile(
    oldData.concat([
      {
        date: new Date().toLocaleString(),
        price: priceNum,
      },
    ])
  );
}
saveEveryDayPrice();
setInterval(saveEveryDayPrice, 1000 * 60 * 60 * 24);
export async function getHistroyPrice() {
  return await readFile();
}
export async function getTodayPrice() {
  const res = await getPriceResult();
  const path =
    "$.result.PriceList[?(@.Tld=='.zone' && @.Operation == 'renew'&& @.Year==1)].Price";
  const price = jp.query(res, path);
  const priceNum = Number(price[0]);
  return priceNum;
}
