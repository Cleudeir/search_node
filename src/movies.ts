import Server from "./class/Server";
import { DataMovie } from "./components/interfaces";
import infoMovie from "./api/info/movie";
import discorver from "./api/tmdb/discorver";
import server from "./class/Server";
import { DataMovie,  discoverProps } from "./components/interfaces";
import cache2 from "./components/cache2";
import { findTmdb } from "./api/tmdb/find";

export async function startMovie(dataMovie: DataMovie[]) {

    server.get("/all/movie", async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now();       
        console.log("time: ", (Date.now() - time) / 1000, "s");       
        _res.status(200).json(dataMovie);
      });

      server.post("/tmdb/movie", async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now();   
        const {item} = _req.body as unknown as {item: DataMovie};    
        const _data = await cache2(item?.title, {item, type: 'movie'}, findTmdb)     
        console.log("time: ", (Date.now() - time) / 1000, "s");
        console.log(_data?.title)  
        _res.status(200).json(_data);
      });

    Server.post("/info/movie", async (_req: Req, _res: Resp): Promise<void> => {
      const time = Date.now();
      const item = _req.body as unknown as DataMovie;
      console.log("/info/movie", item.title);
      const data = await infoMovie(item);
      console.log("time: ", (Date.now() - time) / 1000, "s");
      _res.status(200).json(data);
    });
    server.post(
      "/tmdb/category/movie",
      async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now();
        console.log("time: ", time);
        const item = _req.body as unknown as discoverProps;
        console.log("/tmdb/category/movie", item.genreId);
        const data = await discorver(dataMovie, item);
        console.log("time: ", (Date.now() - time) / 1000, "s");
        _res.status(200).json(data);
      }
    );
    server.post(
      "/tmdb/popular/movie",
      async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now();
        const item = _req.body as unknown as discoverProps;
        const data = await discorver(dataMovie, item);
        console.log("time: ", (Date.now() - time) / 1000, "s");
        _res.status(200).json(data);
      }
    );
  }