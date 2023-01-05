import asyncCrawlerSingle from "../components/asyncCrawler";
import cache from './../components/cache';
import { DataTv } from "../components/interfaces";

async function getData(_url: string): Promise<DataTv[]> {
  const get: any = await asyncCrawlerSingle(_url);
    const response : string[] = [];
    get.querySelectorAll("a").forEach((x: { innerHTML: any; href: any }) => {
      if (x.innerHTML === "<b>Acessar</b>" || x.innerHTML === "Acessar") {
        response.push(x.href);
      }
    });
    const data: DataTv[] = [];
    for (let i = 0; i < response.length; i++) {
      const url: string = String(response[i]);
      const [title]: string[] = url
        .replace("/browse-", "")
        .split("-")
        .join(" ")
        .split(" videos");
      data.push({ id: i, url, title });
    }
    console.log("mapSeries: ", data.length);
    return data
}

export default async function mapTv(): Promise<DataTv[]> {
  const url = "https://redecanais.la/mapa.html";
  const data: DataTv[] = await cache(url,getData)
  return data
}