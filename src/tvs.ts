import infoTv from "./api/info/tv";
import infoTvList from "./api/list/tv";
import discorver, { normalize } from "./api/tmdb/discorver";
import { findTmdb } from "./api/tmdb/find";
import server from "./class/Server";
import cache2 from "./components/cache2";
import {  DataTv, discoverProps } from "./components/interfaces";

export async function startTv(dataTv: DataTv[]) {

    server.get("/all/tv", async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now();       
        console.log("time: ", (Date.now() - time) / 1000, "s");       
        _res.status(200).json(dataTv);
      });

      server.post("/tmdb/tv", async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now();   
        const {item} = _req.body as unknown as {item: DataTv};    
        const _data = await cache2(item?.title, {item, type: 'tv'}, findTmdb)     
        console.log("time: ", (Date.now() - time) / 1000, "s");
        console.log(_data?.title)  
        _res.status(200).json(_data);
      });
    

    server.post("/list/tv", async (_req: Req, _res: Resp): Promise<void> => {
      const time = Date.now();
      const item = _req.body as unknown as DataTv;
      console.log("/list/tv", item.title);
      const data = await infoTvList(item);
      console.log("time: ", (Date.now() - time) / 1000, "s");
      _res.status(200).json(data);
    });
  
    server.post("/info/tv", async (_req: Req, _res: Resp): Promise<void> => {
      const time = Date.now();
      const item = _req.body as unknown as DataTv;
      console.log("/info/tv", item);
      const data = await infoTv(item);
      console.log("time: ", (Date.now() - time) / 1000, "s");
      _res.status(200).json(data);
    });
    server.post(
      "/tmdb/category/tv",
      async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now();
        const item = _req.body as unknown as discoverProps;
        console.log("/tmdb/category/tv", item.genreId);
        const data = await discorver(dataTv, item);
        console.log("time: ", (Date.now() - time) / 1000, "s");
        _res.status(200).json(data);
      }
    );
    server.post(
      "/tmdb/popular/tv",
      async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now();
        const item = _req.body as unknown as discoverProps;
        console.log("/tmdb/popular/tv", item);
        const data = await discorver(dataTv, item);
        console.log("time: ", (Date.now() - time) / 1000, "s");
        _res.status(200).json(data);
      }
    );
  }