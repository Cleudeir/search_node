import cache from "../../components/cache";
import fileCrawler from "../../components/fileCrawler";
import { DataMovie } from '../../components/interfaces';
import * as fs from "fs/promises";
import { resolve } from 'path';
import asyncCrawlerSingle from '../../components/asyncCrawler';
async function getData(_url: string): Promise<DataMovie[]> {
  let get: any ;
  if(_url.includes('https')){
    get = await asyncCrawlerSingle(_url)
  }else{
    get= await fileCrawler(_url);
  }
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
  return data
}

export default async function mapMovie(): Promise<DataMovie[]> {  
    const _url = "https://redecanais.la" + '/mapafilmes.html';
    const data = await cache(_url, getData);
    const num = 11000
    if(data.length > num){
      console.log("data1", data.length);
      return data
    }else{
      console.log("error");
      const url = "./src/list/mapafilmes";
      const data: DataMovie[] = await cache(url + ".html", getData)        
      if(data.length > num) { 
        console.log("data2", data.length);       
        return data
      } else {
        const websiteHtml = await fs.readFile(resolve(url + '.json'));
        const newLocal = Buffer.from(websiteHtml) as any;
        const data = JSON.parse(newLocal)
        console.log('data3: ', data.length);
        return data
      }
    }

}
