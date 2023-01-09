import fetch from "node-fetch";
import asyncCrawlerSingle from "../components/asyncCrawler";
import cache from "../components/cache";
import { DataMovie } from "../components/interfaces";

async function getMovie(_url: string): Promise<string | null> {
  const doc: any = await asyncCrawlerSingle(_url);
  if (doc === null || doc === undefined) {
    return null
  }
  const response : any | string | undefined = doc.querySelectorAll('iframe[name="Player"]')[0]?.attributes.src.textContent
  if (response?.length> 0 || response === null || response === undefined) {
    return null
  }
  const [one, two] = response.split(".php");
  const url: string = `${one}hlb.php${two}`;
  return url;
}

export default async function infoMovie(item: DataMovie): Promise<DataMovie | null> {
  const urlBase = "https://redecanais.la"+ item.url;
    const url: string | null = await cache(urlBase,getMovie);
    if (url === null) {return url}
    const data = {...item, url}
    return data  
}
