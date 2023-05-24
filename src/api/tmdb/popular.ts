import fetch from "node-fetch";
import cache2 from "../../components/cache2";
import { categoryProps, popularProps } from "../../components/interfaces";

async function getData(
    param: any
): Promise<any[]> {
    console.log('param: ', param);
    const url = `https://api.themoviedb.org/3/discover/${param.type}?api_key=5417af578f487448df0d4932bc0cc1a5&language=pt-BR&sort_by=popularity.desc&page=`;
    const _fetch = async (url: string, page: number) => {
        const resp = await fetch(url + page);
        const result = await resp.json();
        return result.results;
    }
    const PromiseTrending = await Promise.all([
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
    const order = trending.sort((a, b) => a.vote_average <  b.vote_average ? 1 : -1);
    return order
}


export default async function popular(item: popularProps): Promise<any> {
    const name = item.type + "-" + "popular";
    console.log('name: ', name);
    const data: string | undefined = await cache2(name, item, getData);
    if (data) {
        return data
    }
}
