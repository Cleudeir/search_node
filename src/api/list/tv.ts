/* eslint-disable array-callback-return */
import asyncCrawlerSingle from "../../components/asyncCrawler";
import { DataTv, episode } from "../../components/interfaces";
import cache from "../../components/cache";
import fetch from "node-fetch";

function formatNumberWithDigits(num: number): string {
  return num.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

async function geTv(url: string): Promise<episode[] | null> {
  console.log("response ", url);
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
  console.log("response: ", response.length);
  for (let i = 0; i < response.length; i++) {
    const url = String(response[i]);
    const item = { id: episodes.length, url };
    episodes.push(item);
  }
  return episodes;
}
async function getTmdbID(
  item: DataTv,
  episodes: any[]
): Promise<any> {
  try {
    const id = item.id;
    const pullInfo = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=5417af578f487448df0d4932bc0cc1a5&language=pt-BR`
    );
    const jsonInfo = await pullInfo.json();
    let result;
    if (jsonInfo) {
      const seasons = jsonInfo.seasons.map((x: any) => x.episode_count);
      if (
        Object.keys(episodes).length < seasons.reduce((a: any, b: any) => a + b)
      ) {
        result = episodes;
      } else {
        let countEpisodes: number = 0;
        let countSeasons: number = 0;
        const _episodes = episodes.map((x, i) => {
          if (countEpisodes < seasons[countSeasons]) {
            const episodeNumber = countEpisodes + 1;
            const seasonNumber = countSeasons + 1
            countEpisodes++;
            return {
              ...x,
              name: `T${formatNumberWithDigits(
                seasonNumber
              )}EP${formatNumberWithDigits(episodeNumber)}`,
            };
          } else {
            countSeasons++;
            countEpisodes = 1;
            const seasonNumber = countSeasons + 1
            return {
              ...x,
              name: `T${formatNumberWithDigits(
                seasonNumber
              )}EP${formatNumberWithDigits(countEpisodes)}`,
            };
          }
        });
        console.log(seasons)
        result =  _episodes;
      }
      return result;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export default async function infoTvList(item: DataTv): Promise<DataTv | null> {
  const url = "https://redecanais.la/" + item.url + ".html";
  console.log("url: ", url);
  const episodes = await cache(url, geTv);
  const infos = await getTmdbID(item, episodes);
  if (episodes === null) {
    return null;
  }
  const data = infos;
  return data;
}
