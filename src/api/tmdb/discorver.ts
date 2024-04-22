/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fetch from "node-fetch";
import cache2 from "../../components/cache2";
import { DataMovie, DataTv, discoverProps } from "../../components/interfaces";
import dotenv from 'dotenv';
dotenv.config();

async function getData({
  data,
  item,
}: {
  data: any[];
  item: any;
}): Promise<any[] | []> {
  try {
    console.log(data.length, item);
    let url = `https://api.themoviedb.org/3/trending/${item.type}/week?language=pt-BR`;

    const requests = [];
    const token = `Bearer ${process.env.TMDB_TOKEN}`
    const _fetch = async (url: string, page?: number) => {
      console.log("url: ", url);
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: token
        },
      };

      const resp = await fetch(url + "&page=" + page, options);

      const result = await resp.json();
      return result.results;
    };

    console.log(" item.genreId: ", item.genreId);
    if (item.genreId && Number(item.genreId) !== 1) {
      url = `https://api.themoviedb.org/3/discover/${item.type}?language=pt-BR&sort_by=popularity.desc&with_genres=${item.genreId}`;
      for (let index = 0; index < 10; index++) {
        requests.push(_fetch(url, index));
      }
    } else {
      for (let index = 0; index < 10; index++) {
        requests.push(_fetch(url, index));
      }
    }

    const PromiseTrending = await Promise.all(requests);
    const trending = PromiseTrending.flat();
    const trendingUnique: any[] = [];

    const normalize = (text: string) => {
      return text?.replace(/[^\w\s]/gi, "").toLowerCase();
    };

    trending.map((_item) => {
      if (item.type === "movie") {
        const filtered = data.find(
          ({ title }: { title: string }) =>
            normalize(title) === normalize(_item?.title)
        );
        if (filtered && _item.title !== "" && _item.vote_average >= 5) {
          const unique = trendingUnique.find(
            (obj) => normalize(obj.title) === normalize(_item.title)
          );
          if (!unique) trendingUnique.push({ ..._item, ...filtered });
        }
      } else if (item.type === "tv") {
        const filtered = data.find(
          ({ title }: { title: string }) =>
            normalize(title) === normalize(_item?.name)
        );
        if (filtered && _item.name !== "" && _item.vote_average >= 5) {
          const unique = trendingUnique.find(
            (obj) => normalize(obj.name) === normalize(_item.name)
          );
          if (!unique) trendingUnique.push({ ..._item, ...filtered });
        }
      }
    });

    return trendingUnique;
  } catch (error) {
    return []
  }
}

export default async function discorver(
  data: DataMovie[] | DataTv[],
  item: discoverProps
): Promise<any> {
  let name = "discorver-" + item.type;
  if (item.genreId) name = name + "-" + item.genreId;
  // const _data: any = await getData({ data, item });
  const _data: any = await cache2(name, { data, item }, getData);
  if (_data) {
    return _data;
  }
}
