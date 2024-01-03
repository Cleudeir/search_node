import fetch from "node-fetch";
import cache2 from "../../components/cache2";
import { DataMovie, DataTv, discoverProps } from "../../components/interfaces";

async function getData({
  data,
  item,
}: {
  data: any[];
  item: any;
}): Promise<any[]> {
  console.log(data.length, item);
  let url = `https://api.themoviedb.org/3/trending/${item.type}/day?language=pt-BR`;

  const requests = [];

  const _fetch = async (url: string, page?: number) => {
    console.log("url: ", url);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlODczOGJjN2NmNWZmMGRhYjBjMDI0YTE1MTdmNjU5MSIsInN1YiI6IjY1OTVjOGYxZWEzN2UwMDg5YzRiOTZjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eAJdpt_zAG6bLGS6AWQq2yZA10UwUFRi7DgYNseNIbE",
      },
    };

    const resp = await fetch(page ? url + "&page=" + page : url, options);

    const result = await resp.json();
    return result.results;
  };

  if (item.genreId) {
    url = `https://api.themoviedb.org/3/discover/${item.type}?language=pt-BR&sort_by=popularity.desc&with_genres=${item.genreId}`;
    for (let index = 0; index < 50; index++) {
      requests.push(_fetch(url, index));
    }
  } else {
    for (let index = 0; index < 10; index++) {
      requests.push(_fetch(url, index));
    }
  }

  const PromiseTrending = await Promise.all(requests);
  const trending = PromiseTrending.flat();
  const trendingUnique = new Set();

  trending.map((_item) => {
    if (item.type === "movie") {
      const [filterd] = data.filter(
        ({ title }: { title: string }) =>
          title?.replace(/[^\w\s]/gi, "").toLowerCase() ===
          _item?.title.replace(/[^\w\s]/gi, "").toLowerCase()
      );
      if (
        filterd &&
        (_item.title !== "" || _item.name !== "") &&
        _item.vote_average >= 5
      ) {
        trendingUnique.add(JSON.stringify({ ..._item, ...filterd }));
      }
    } else if (item.type === "tv") {
      const [filterd] = data.filter(
        ({ title }: { title: string }) =>
          title?.replace(/[^\w\s]/gi, "").toLowerCase() ===
          _item?.name.replace(/[^\w\s]/gi, "").toLowerCase()
      );
      if (
        filterd &&
        (_item.title !== "" || _item.name !== "") &&
        _item.vote_average >= 5
      ) {
        trendingUnique.add(JSON.stringify({ ..._item, ...filterd }));
      }
    }
  });
  const filterTrending = [...trendingUnique].map((item) => JSON.parse(item));

  const order = filterTrending.sort((a, b) =>
    a.vote_average < b.vote_average ? 1 : -1
  );
  return order;
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
