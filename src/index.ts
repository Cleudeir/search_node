/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import fs from "fs";
import os from "os";
import infoMovie from "./api/info/movie";
import infoTv from "./api/info/tv";
import infoTvList from "./api/list/tv";
import mapMovie from "./api/map/movie";
import mapTv from "./api/map/tv";
import discorver from "./api/tmdb/discorver";
import server from "./class/Server";
import { DataMovie, DataTv, discoverProps } from "./components/interfaces";
import { startMovie } from "./movies";
import { startTv } from "./tvs";
import { genres } from "./components/genres";
const dir = os.homedir() + "/temp/search";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

interface Resp extends express.Response {
  status: (a: any) => any;
}
interface Req extends express.Request {
  body: { item: DataMovie | DataTv };
}
server.get("/", async (_req: Req, _res: Resp): Promise<void> => {
  _res.status(200).json({ status: 'online' });
});
// movie



mapMovie().then(async (dataMovie) => {
  await startMovie(dataMovie);

  let index = 0
  const type = 'movie'
  const _funcion = async (item) => {
    index += 1
    await discorver(dataMovie, {
      genreId: item.id,
      type
    })
    if (genres[type].length > index) {
      setTimeout(() => {
        _funcion(genres[type][index])
      }, 1500)
    }
  }
  _funcion(genres[type][index])
});
// tv

mapTv().then(async (dataTv) => {
  await startTv(dataTv);

  let index = 0
  const type = 'tv'
  const _funcion = async (item) => {
    index += 1
    await discorver(dataTv, {
      genreId: item.id,
      type
    })
    if (genres[type].length > index) {
      setTimeout(() => {
        _funcion(genres[type][index])
      }, 2000)
    }
  }
  _funcion(genres[type][index])
});

