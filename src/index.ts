/* eslint-disable @typescript-eslint/no-misused-promises */
import infoMovie from './api/infoMovie';
import infoTv from './api/infoTv';
import mapMovie from './api/mapMovie';
import mapTv from './api/mapTv';
import server from './class/Server';
import express from 'express';
import { DataMovie, DataTv } from './components/interfaces';

interface Resp extends express.Response {
    status: (a:any) => any
}
interface Req extends express.Request {
    body: {item: DataMovie | DataTv }
}

server.get('/', async (_req: Req, _res: Resp): Promise<void> => {
    _res.status(200).json('online')
})
// movie
server.get('/api/mapMovie', async (_req: Req, _res: Resp): Promise<void> => {
    const data = await mapMovie()
    console.log('mapMovie')
    _res.status(200).json(data)
})
server.post('/api/infoMovie', async (_req: Req, _res: Resp): Promise<void> => {
    const item = _req.body.item as DataMovie
    const data = await infoMovie(item)
    console.log('infoMovie ',item.title)
    _res.status(200).json(data)
})

// tv
server.get('/api/mapTv', async (_req: Req, _res: Resp): Promise<void> => {
    const data = await mapTv()
    console.log('mapTv')
    _res.status(200).json(data)
})
server.post('/api/infoTv', async (_req: Req, _res: Resp): Promise<void> => {
    const item = _req.body.item as DataTv
    const data = await infoTv(item)
    console.log('infoTv ',item.title)
    _res.status(200).json(data)
})