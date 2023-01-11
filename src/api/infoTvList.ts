import asyncCrawlerSingle from "../components/asyncCrawler";
import { DataTv, episode } from "../components/interfaces";
import cache from '../components/cache';
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
    const url = String(response[i])
    const item = { id: episodes.length, url }
    episodes.push(item);
  }
  return episodes;
}

export default async function infoTvList(item: DataTv): Promise<DataTv | null> {
  const url = "https://redecanais.la/" + item.url + '.html';
  console.log('url: ', url);
  const episodes = await cache(url, geTv);
  if (episodes === null) { return episodes }
  const data = { ...item, episodes }
  return data
}
