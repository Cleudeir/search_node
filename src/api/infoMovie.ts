import fetch from "node-fetch";
import asyncCrawlerSingle from "../components/asyncCrawler";
import cache from "../components/cache";
import { DataMovie } from "../components/interfaces";

async function getMovie(_url: string): Promise<string | null> {
  const doc: any = await asyncCrawlerSingle(_url);
  if (doc === null || doc === undefined) {
    return null
  }
  const response : string | undefined = doc.querySelectorAll('iframe[name="Player"]')[0].attributes.src.textContent
  if (response === null || response === undefined) {
    return null
  }
  const [one, two] = response.split(".php");
  const url: string = `${one}hlb.php${two}`;
  return url;
}

async function getIMDB(item: DataMovie): Promise<DataMovie | null> {
  try {
    const title = item.title.toLowerCase().split(" ").join("+");
    const { year } = item;
    const pullInfo = await fetch(
      `https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&language=pt-BR&api_key=5417af578f487448df0d4932bc0cc1a5&query=${title}&year=${year}`
    );
    const jsonInfo = await pullInfo.json();
    if (jsonInfo?.results[0]?.id) {
      const obj = {
        ...item,
        ...jsonInfo.results[0],
        backdrop_path: jsonInfo.results[0].backdrop_path
          ? "https://image.tmdb.org/t/p/original/" +
            jsonInfo.results[0].backdrop_path
          : null,
        poster_path: jsonInfo.results[0].poster_path
          ? "https://image.tmdb.org/t/p/w342" + jsonInfo.results[0].poster_path
          : null
      };
      return obj;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export default async function infoMovie(item: DataMovie): Promise<DataMovie | null> {
  const urlBase = "https://redecanais.la"+ item.url;
  console.log(urlBase)
    const url: string | null = await cache(urlBase,getMovie);
    if (url === null) {return url}
    const itemMovie = {...item, url}
    const data = await getIMDB(itemMovie);
    return data  
}
