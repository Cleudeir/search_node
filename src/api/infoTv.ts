import fetch from "node-fetch";
import asyncCrawlerSingle from "../components/asyncCrawler";
import { DataTv, episode } from "../components/interfaces";
import cache from './../components/cache';

async function geTv(url: string): Promise<episode[] | null> {
  const doc1: any = await asyncCrawlerSingle(url);
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
    return null;
  }
  const episodes: episode[] = [];
  for (let i = 0; i < response.length; i++) {
    console.log(i, "/", response.length - 1);
    const link = "https://redecanais.la" + String(response[i]);
    const doc2: any = await asyncCrawlerSingle(link);

    if (doc2 === undefined || doc2 === null) {
      episodes.push({ id: episodes.length, url: link });
      console.log("Error url: ", link);
      continue;
    }
    const response2 : string | undefined =
      doc2?.querySelectorAll('iframe[name="Player"]')[0]?.attributes?.src
        .textContent 
    if (response2 === undefined || response2 === null) {
      continue;
    }
    const link2 = String(response2);
    const [one, two] = link2.split(".php");
    const url: string = `${one}hlb.php${two}`;
    episodes.push({ id: episodes.length, url });
  }
  const result = await Promise.all(episodes);
  return result;
}

async function getIMDB(item: DataTv): Promise<DataTv | null> {
  try {
    const title = item.title.toLowerCase().split(" ").join("+");
    const pullInfo = await fetch(
      `https://api.themoviedb.org/3/search/tv?include_adult=false&page=1&language=pt-BR&api_key=5417af578f487448df0d4932bc0cc1a5&query=${title}`
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

export default async function infoTv(item : DataTv): Promise<DataTv | null> {
  const url = "https://redecanais.la" + item.url;
    const episodes = await cache(url, geTv);
    if (episodes === null) {return episodes}
    const itemPlusEpisodes = {...item, episodes}
    const data = await getIMDB(itemPlusEpisodes)
    return data
}
