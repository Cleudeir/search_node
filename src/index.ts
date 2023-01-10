/* eslint-disable @typescript-eslint/no-misused-promises */
import infoMovie from './api/infoMovie';
import infoTv from './api/infoTv';
import mapMovie from './api/mapMovie';
import mapTv from './api/mapTv';
import server from './class/Server';
import express from 'express';
import { DataMovie, DataTv } from './components/interfaces';
import Delete from './api/Delete';

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

server.get('/api/mapMovie', async (_req: Req, _res: Resp): Promise<void> => {
    const data = await mapMovie()
    const toRemove = await deleteMovie.read()
    const dataFilter = data.filter((item: any): any => !toRemove.includes(item.title))
    console.log('mapMovie')
    _res.status(200).json(dataFilter)
})

server.post('/api/infoMovie', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const item = _req.body.item as DataMovie
    console.log(item.title)
    const data = await infoMovie(item)
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(data)
})

server.delete('/api/deleteMovie', async (_req: Req, _res: Resp): Promise<void> => {
    const item = _req.body.item as DataMovie
    const data = await deleteMovie.insert(item)
    console.log('ExcludesMovie ', data)
    _res.status(200).json(data)
})

// tv
const deleteTv = new Delete('ExcludesTv')

server.get('/api/mapTv', async (_req: Req, _res: Resp): Promise<void> => {
    const data = await mapTv()
    const toRemove = await deleteTv.read()
    const dataFilter = data.filter((item: any): any => !toRemove.includes(item.title))
    console.log('mapTv')
    _res.status(200).json(dataFilter)
})

server.post('/api/infoTv', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const item = _req.body.item as DataTv
    console.log(item.title)
    const data = await infoTv(item)
    console.log('infoTv ', data?.title)
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(data)
})

server.delete('/api/deleteTv', async (_req: Req, _res: Resp): Promise<void> => {
    const item = _req.body.item as DataMovie
    const data = await deleteTv.insert(item)
    console.log('ExcludesTv', data)
    _res.status(200).json(data)
})
