/* eslint-disable @typescript-eslint/no-misused-promises */
import infoMovie from './api/info/movie';
import infoTvList from './api/list/tv';
import mapMovie from './api/map/movie';
import mapTv from './api/map/tv';
import server from './class/Server';
import express from 'express';
import { DataMovie, DataTv, categoryProps, popularProps } from './components/interfaces';
import Delete from './api/Delete';
import infoTv from './api/info/tv'
import fs from 'fs';
import category from './api/tmdb/category';
import popular from './api/tmdb/popular';
const os = require('os');
const dir = os.homedir() +'/temp'
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
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
const deleteMovie = new Delete('ExcludesMovie')

// create a function receive http request Header and identify who make this request
server.get('/map/movie', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const data = await mapMovie()
    console.log('/map/movie')
    const toRemove = await deleteMovie.read() as any[]
    const dataFilter = data?.filter((item: any): any => !toRemove.includes(item.title))
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(dataFilter)
})

server.post('/info/movie', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const item = _req.body as unknown as DataMovie
    console.log('/info/movie', item.title)
    const data = await infoMovie(item)
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(data)
})
server.post('/tmdb/category', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const item = _req.body as unknown as categoryProps
    console.log('/tmdb/category', item.genreId)
    const data = await category(item)
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(data)
})
server.post('/tmdb/popular', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const item = _req.body as unknown as popularProps
    console.log('/tmdb/popular', item.type)
    const data = await popular(item)
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(data)
})

server.delete('/delete/movie', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const item = _req.body as unknown as DataMovie
    console.log('/delete/movie', item.title)
    const data = await deleteMovie.insert(item)
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(data)
})

// tv
const deleteTv = new Delete('ExcludesTv')

server.get('/map/tv', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const data = await mapTv()
    console.log('/map/tv')
    const toRemove = await deleteTv.read() as any[]
    const dataFilter = data.filter((item): any => {
        return !toRemove.includes(item.title);
    })
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(dataFilter)
})

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

server.delete('/delete/tv', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const item = _req.body as unknown as DataMovie
    console.log('/delete/tv', item.title)
    const data = await deleteTv.insert(item)
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(data)
})
