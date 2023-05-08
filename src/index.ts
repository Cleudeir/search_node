/* eslint-disable @typescript-eslint/no-misused-promises */
import infoMovie from './api/info/movie';
import infoTvList from './api/list/tv';
import mapMovie from './api/map/movie';
import mapTv from './api/map/tv';
import server from './class/Server';
import express from 'express';
import { DataMovie, DataTv } from './components/interfaces';
import Delete from './api/Delete';
import infoTv from './api/info/tv'
import  fs  from 'fs';

const dir = './temp'
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
    const data = await mapMovie()
    const toRemove = await deleteMovie.read()
    const dataFilter = data?.filter((item: any): any => !toRemove.includes(item.title))
    _res.status(200).json(dataFilter)
})

server.post('/info/movie', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const item = _req.body as unknown as DataMovie
    console.log(item.title)
    const data = await infoMovie(item)
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(data)
})

server.delete('/delete/movie', async (_req: Req, _res: Resp): Promise<void> => {
    const item = _req.body as unknown as DataMovie
    const data = await deleteMovie.insert(item)
    console.log('ExcludesMovie ', data)
    _res.status(200).json(data)
})

// tv
const deleteTv = new Delete('ExcludesTv')

server.get('/map/tv', async (_req: Req, _res: Resp): Promise<void> => {
    const data = await mapTv()
    const toRemove = await deleteTv.read()
    const dataFilter = data.filter((item: any): any => !toRemove.includes(item.title))
    _res.status(200).json(dataFilter)
})

server.post('/list/tv', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const item = _req.body as unknown as DataTv
    console.log('infoTvList item: ', item);
    const data = await infoTvList(item)   
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(data)
})

server.post('/info/tv', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const item = _req.body as unknown as DataTv
    console.log('infoTv item: ', item);   
    const data = await infoTv(item)
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(data)    
})

server.delete('/delete/tv', async (_req: Req, _res: Resp): Promise<void> => {
    const item = _req.body as unknown as DataMovie
    const data = await deleteTv.insert(item)
    console.log('ExcludesTv', data)
    _res.status(200).json(data)
})
