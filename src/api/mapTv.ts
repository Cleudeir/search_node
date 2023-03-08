import cache from "../components/cache";
import fileCrawler from "../components/fileCrawler";
import { DataTv } from "../components/interfaces";
import * as fs from "fs/promises";
import { resolve } from 'path';
async function getData(_url: string): Promise<DataTv[]> {
  console.log('_url: ', _url);
  const get: any = await fileCrawler(_url);
  const response: string[] = [];
  console.log('response: ', response);
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

    const _url = "https://redecanais.la" + '/mapa.html';   
    const data = await cache(_url, getData);
    const num = 5000
    if(data.length > num){
      console.log('data1: ', data.length);
      return data
    }else{
      const url = "./src/list/mapa";      
        const data: DataTv[] = await cache(url + ".html", getData)
        if(data.length > num){
        console.log('data2: ', data.length);
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