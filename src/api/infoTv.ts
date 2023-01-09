import fetch from "node-fetch";
import asyncCrawlerSingle from "../components/asyncCrawler";
import { DataTv, episode } from "../components/interfaces";
import cache from './../components/cache';
function sleep(ms: number | undefined) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}
async function geTv(url: string): Promise<episode[] | null> {
  console.log('response ' ,url);
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
  console.log('response' ,response.length - 1);
  if (response.length === 0) {
    console.log("Error");
    return null;
  }
  const episodes: episode[] = [];

  for (let i = 0; i < response.length; i++) {   
    console.log(i, "/", response.length - 1);
    const link = "https://redecanais.la" + String(response[i]);
    if(Number.isInteger(response.length/30)){
      await sleep(1000)
    }
    asyncCrawlerSingle(link).then((doc2)=>{
      if (doc2 === undefined || doc2 === null) {
        episodes.push({ id: episodes.length, url: link });
        console.log("Error url: ", link);
        return;
      }
      const response2 : string | undefined =
        doc2?.querySelectorAll('iframe[name="Player"]')[0]?.attributes?.src
          .textContent 
      if (response2 === undefined || response2 === null) {
        return;
      }
      const link2 = String(response2);
      const [one, two] = link2.split(".php");
      const url: string = `${one}hlb.php${two}`;
      episodes.push({ id: episodes.length, url });
    });
}
const result = await Promise.all(episodes);
return result;
}

export default async function infoTv(item : DataTv): Promise<DataTv | null> {
  const url = "https://redecanais.la" + item.url;
    const episodes = await cache(url, geTv);
    if (episodes === null) {return episodes}
    const data = {...item, episodes}
    return data
}
