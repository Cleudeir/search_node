import fetch from "node-fetch";
import cache2 from "../../components/cache2";
import { DataMovie, DataTv, discoverProps } from "../../components/interfaces";

async function getData(
  { data, item }: { data: any[], item: any }
): Promise<any[]> {
  let url = `https://api.themoviedb.org/3/discover/${item.type}?api_key=5417af578f487448df0d4932bc0cc1a5&language=pt-BR&sort_by=popularity.desc`
  if (item.genreId) {
    url = url + `&with_genres=${item.genreId}`
    
  }
  console.log('url: ', url);
  const _fetch = async (url: string, page: number) => {
    const resp = await fetch(url + "&page=" + page);
    const result = await resp.json();
    return result.results;
  }
  const PromiseTrending = await Promise.all([   
    _fetch(url, 40),
    _fetch(url, 39),
    _fetch(url, 38),  
    _fetch(url, 37),
    _fetch(url, 36),
    _fetch(url, 35),
    _fetch(url, 34),
    _fetch(url, 33),
    _fetch(url, 32),
    _fetch(url, 31),
    _fetch(url, 30),
    _fetch(url, 29),
    _fetch(url, 28),
    _fetch(url, 27),  
    _fetch(url, 26),
    _fetch(url, 25),
    _fetch(url, 24),
    _fetch(url, 23),
    _fetch(url, 22),
    _fetch(url, 21),
    _fetch(url, 20),
    _fetch(url, 19),
    _fetch(url, 18),
    _fetch(url, 17),
    _fetch(url, 16),
    _fetch(url, 15),
    _fetch(url, 14),
    _fetch(url, 13),
    _fetch(url, 12),
    _fetch(url, 11),
    _fetch(url, 10),
    _fetch(url, 9),
    _fetch(url, 8),
    _fetch(url, 7),
    _fetch(url, 6),
    _fetch(url, 5),
    _fetch(url, 4),
    _fetch(url, 3),
    _fetch(url, 2),
    _fetch(url, 1),
  ]);

  const trending = PromiseTrending.flat();

  const filterTrending = trending.map(_item => {
    if (item.type === 'movie') {
      const [filterd] = data.filter(({ title }: { title: string }) => title.replace(/[^\w\s]/gi, "").toLowerCase() === _item.title.replace(/[^\w\s]/gi, "").toLowerCase())
      if (filterd) return { ..._item, ...filterd }
    }
    else if(item.type === 'tv'){
      const [filterd] = data.filter(({ title }: { title: string }) => title.replace(/[^\w\s]/gi, "").toLowerCase() === _item.name.replace(/[^\w\s]/gi, "").toLowerCase())
      if (filterd) return { ..._item, ...filterd }
    }

  })
  const filterTrendingNull = filterTrending.filter(x => x != null).filter(x => x.title !== "" || x.name !== "").filter(x => x.vote_average >= 5)

  const order = filterTrendingNull.sort((a, b) => a.vote_average < b.vote_average ? 1 : -1);
  return order
}


export default async function discorver(data: DataMovie[] | DataTv[], item: discoverProps): Promise<any> {
  let name = 'discorver-' + item.type;
  if (item.genreId) name = name + "-" + item.genreId
  //const _data : any = await getData( { data, item });
  const _data : any = await cache2(name, { data, item }, getData);
  if (_data) {
    return _data
  }
}
