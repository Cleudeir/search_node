import asyncCrawlerSingle from "../components/asyncCrawler";
import { DataTv } from "../components/interfaces";
import cache from '../components/cache';
async function geTv(_url: string): Promise<string | undefined> {
  const doc = await asyncCrawlerSingle(_url)
  if (doc) {
    const response: string | undefined = doc?.querySelectorAll('iframe[name="Player"]')[0]?.attributes?.src.textContent
    console.log('response: ', response);

    if (response) {
      const link2 = String(response);
      const [one, two] = link2.split(".php");
      const url: string = `${one}hlb.php${two}`;
      return url;
    }
  }
}
export default async function infoTv(item: DataTv): Promise<DataTv | null> {
  const _url = "https://redecanais.la" + item.url;
  console.log('url: ', _url);
  const url = await cache(_url, geTv);
  if (url === undefined) { return url }
  const data = { ...item, url }
  return data
}