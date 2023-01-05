import asyncCrawlerSingle from "../components/asyncCrawler";
import cache from './../components/cache';
import { DataMovie } from './../components/interfaces';

async function getData(_url:string):Promise<DataMovie[]> {
  const get: any = await asyncCrawlerSingle(_url);
  const response: string[] = [];
  get.querySelectorAll("a").forEach((x: { innerHTML: any; href: any }) => {
    if (x.innerHTML === "<b>Assistir</b>") {
      response.push(x.href);
    }
  });
  const data: DataMovie[] = [];
  for (let i = 0; i < response.length; i++) {
    const url: string = String(response[i]);
    const [baseArray]: string[] = url
      .replace("/", "")
      .split("-")
      .join(" ")
      .split("_");
    const baseString = baseArray.split(" ");
    const title: string = baseString
      .slice(0, -2)
      .filter((item: string) => item !== "dublado")
      .join(" ");
    const dub: boolean = baseString.includes("dublado");
    const [year, quality]: string[] = baseString.slice(-2);
    data.push({ id: i, url, title, quality, year, dub });
  }

  console.log("mapMovie: ", data.length);
  return data
}

export default async function mapMovie(): Promise<DataMovie[]> {
  const url = "https://redecanais.la/mapafilmes.html";
  const data: DataMovie[] = await cache(url,getData)
  return data
}
