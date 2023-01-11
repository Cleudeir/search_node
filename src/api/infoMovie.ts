import asyncCrawlerSingle from "../components/asyncCrawler";
import cache from "../components/cache";
import { DataMovie } from "../components/interfaces";

async function getMovie(_url: string): Promise<string | undefined> {
  const doc: any = await asyncCrawlerSingle(_url);
  if (doc) {
    const response: any | string | undefined = doc.querySelectorAll('iframe[name="Player"]')[0]?.attributes.src.textContent
    if (response) {
      const [one, two] = response.split(".php");
      const url: string = `${one}hlb.php${two}`;
      return url;
    }
  }
}

export default async function infoMovie(item: DataMovie): Promise<DataMovie | null> {
  const _url = "https://redecanais.la/" + item.url + '.html';
  console.log('urlBase: ', _url);
  const url: string | undefined = await cache(_url, getMovie);
  if (url === undefined) {
    console.log('url Error: ', url);
    return null
  }
  const data = { ...item, url }
  console.log('data: ', data);
  return data
}
