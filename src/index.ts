/* eslint-disable @typescript-eslint/no-misused-promises */
import infoMovie from './api/infoMovie';
import infoTvList from './api/infoTvList';
import mapMovie from './api/mapMovie';
import mapTv from './api/mapTv';
import server from './class/Server';
import express from 'express';
import { DataMovie, DataTv } from './components/interfaces';
import Delete from './api/Delete';
import infoTv from './api/infoTv'

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
    console.log('data: ', data.length);
    const toRemove = await deleteMovie.read()
    console.log('toRemove: ', toRemove.length);
    const dataFilter = data.filter((item: any): any => !toRemove.includes(item.title))
    console.log('dataFilter: ', dataFilter.length);
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
    console.log('data: ', data.length);
    const toRemove = await deleteTv.read()
    console.log('toRemove: ', toRemove.length);
    const dataFilter = data.filter((item: any): any => !toRemove.includes(item.title))
    console.log('dataFilter: ', dataFilter.length);
    _res.status(200).json(dataFilter)
})

server.post('/api/infoTvList', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const item = _req.body.item as DataTv
    const data = await infoTvList(item)
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(data)
})

server.post('/api/infoTv', async (_req: Req, _res: Resp): Promise<void> => {
    const time = Date.now()
    const item = _req.body.item as DataTv
    const data = await infoTv(item)
    console.log('infoTv ', data?.url)
    console.log('time: ', (Date.now() - time) / 1000, 's')
    _res.status(200).json(data)
})

server.delete('/api/deleteTv', async (_req: Req, _res: Resp): Promise<void> => {
    const item = _req.body.item as DataMovie
    const data = await deleteTv.insert(item)
    console.log('ExcludesTv', data)
    _res.status(200).json(data)
})
