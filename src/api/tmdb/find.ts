/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fetch from "node-fetch";
import cache2 from "../../components/cache2";
import dotenv from 'dotenv';
dotenv.config();

export const normalize = (text: string) => {
  return text?.replace(/[^\w\s]/gi, "").toLowerCase();
};

export async function findTmdb(
  { item , type}: { item: any }): Promise<any[] | []> {
  try {
    let url = `https://api.themoviedb.org/3/search/${type}?query=${item?.title.replace(/ /g, '+')}&language=pt-BR`;
    const token = `Bearer ${process.env.TMDB_TOKEN}`
    console.log("url: ", url);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: token
      },
    };
    const resp = await fetch(url, options);
    const { results } = await resp.json();
    const [result] = results
    console.log('result: ', result)
    return { ...item, ...result };

  } catch (error) {
    console.log(error)
    return null
  }
}
