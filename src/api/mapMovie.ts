import cache from "../components/cache";
import fileCrawler from "../components/fileCrawler";
import { DataMovie } from './../components/interfaces';
import * as fs from "fs/promises";
import { resolve } from 'path';
async function getData(_url: string): Promise<DataMovie[]> {
  const get: any = await fileCrawler(_url);
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
  const url = "./src/list/mapafilmes";
  try {
    const websiteHtml = await fs.readFile(resolve(url + '.json'));
    const text = JSON.parse(Buffer.from(websiteHtml))
    console.log('text: ', text);
    return text
  } catch (error) {
    const data: DataMovie[] = await cache(url + ".html", getData)
    return data
  }

}
