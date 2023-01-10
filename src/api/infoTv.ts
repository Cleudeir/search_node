import asyncCrawlerSingle from "../components/asyncCrawler";
import { DataTv, episode } from "../components/interfaces";
import cache from './../components/cache';
function sleep(ms: number | undefined): any {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}
async function geTv(url: string): Promise<episode[] | null> {
  console.log('response ', url);
  const doc1: any = await asyncCrawlerSingle(url);
  if (!doc1) {
    console.log("Error");
    return null;
  }
  const response: string[] = [];

  doc1.querySelectorAll("a").forEach((x: { innerHTML: any; href: any }) => {
    if (x.innerHTML !== "<strong>Legendado</strong>") {
      if (
        x.innerHTML === "<strong>Assistir</strong>" ||
        x.innerHTML === "<strong>Dublado</strong>"
      ) {
        response.push(x.href);
      }
    }
  });
  if (response.length === 0) {
    console.log("Error");
    return null;
  }
  const episodes: episode[] = [];
  console.log('response: ', response.length);
  for (let i = 0; i < response.length; i++) {
    const _url = String(response[i])
    const link = "https://redecanais.la" + _url;
    const doc2 = await asyncCrawlerSingle(link)
    console.log('link', link)
    console.log(i, "/", response.length);
    if (doc2) {
      const response2: string | undefined = doc2?.querySelectorAll('iframe[name="Player"]')[0]?.attributes?.src
        .textContent
      console.log('response2: ', response2);
      if (response2) {
        const link2 = String(response2);
        const [one, two] = link2.split(".php");
        const url: string = `${one}hlb.php${two}`;
        const item = { id: episodes.length, url }
        console.log('item: ', item);
        episodes.push(item);
      }
    }
  }
  const result = await Promise.all(episodes)
  console.log('result: ', result.length);
  return result;
}

export default async function infoTv(item: DataTv): Promise<DataTv | null> {
  const url = "https://redecanais.la/" + item.url + '.html';
  console.log('url: ', url);
  const episodes = await cache(url, geTv);
  if (episodes === null) { return episodes }
  const data = { ...item, episodes }
  return data
}
