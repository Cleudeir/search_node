/* eslint-disable @typescript-eslint/no-misused-promises */
import infoMovie from './api/info/movie';
import infoTvList from './api/list/tv';
import mapMovie from './api/map/movie';
import mapTv from './api/map/tv';
import server from './class/Server';
import express from 'express';
import { DataMovie, DataTv, discoverProps } from './components/interfaces';
import infoTv from './api/info/tv'
import fs from 'fs';
import discorver from './api/tmdb/discorver';
import os from 'os';
const dir = os.homedir() + '/temp/search'
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

interface Resp extends express.Response {
    status: (a: any) => any
}
interface Req extends express.Request {
    body: { item: DataMovie | DataTv }
}
server.get('/', async (_req: Req, _res: Resp): Promise<void> => {
    _res.status(200).json('online')
})
// movie
async function startMovie(dataMovie: DataMovie[]) {  

    server.post('/info/movie', async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now()
        const item = _req.body as unknown as DataMovie
        console.log('/info/movie', item.title)
        const data = await infoMovie(item)
        console.log('time: ', (Date.now() - time) / 1000, 's')
        _res.status(200).json(data)
    })
    server.post('/tmdb/category/movie', async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now()
        const item = _req.body as unknown as discoverProps
        console.log('/tmdb/category/movie', item.genreId)
        const data = await discorver(dataMovie, item)
        console.log('time: ', (Date.now() - time) / 1000, 's')
        _res.status(200).json(data)
    })
    server.post('/tmdb/popular/movie', async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now()
        const item = _req.body as unknown as discoverProps
        console.log('/tmdb/popular/movie', item)
        const data = await discorver(dataMovie, item)
        console.log('time: ', (Date.now() - time) / 1000, 's')
        _res.status(200).json(data)
    })
}

mapMovie().then(dataMovie => startMovie(dataMovie))
// tv

async function startTv(dataTv: DataTv[]) {
    server.post('/list/tv', async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now()
        const item = _req.body as unknown as DataTv
        console.log('/list/tv', item.title);
        const data = await infoTvList(item)
        console.log('time: ', (Date.now() - time) / 1000, 's')
        _res.status(200).json(data)
    })

    server.post('/info/tv', async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now()
        const item = _req.body as unknown as DataTv
        console.log('/info/tv', item);
        const data = await infoTv(item)
        console.log('time: ', (Date.now() - time) / 1000, 's')
        _res.status(200).json(data)
    })
    server.post('/tmdb/category/tv', async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now()
        const item = _req.body as unknown as discoverProps
        console.log('/tmdb/category/tv', item.genreId)
        const data = await discorver(dataTv, item)
        console.log('time: ', (Date.now() - time) / 1000, 's')
        _res.status(200).json(data)
    })
    server.post('/tmdb/popular/tv', async (_req: Req, _res: Resp): Promise<void> => {
        const time = Date.now()
        const item = _req.body as unknown as discoverProps
        console.log('/tmdb/popular/tv', item)
        const data = await discorver(dataTv, item)
        console.log('time: ', (Date.now() - time) / 1000, 's')
        _res.status(200).json(data)
    })
    
}
mapTv().then(dataTv => startTv(dataTv))