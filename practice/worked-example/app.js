import express from 'express';
import {booksRepository} from './repository.js';
import {booksService} from './service.js';
import {queryParser} from '../../reference-app/src/middlewares-$id/pagination.js';
import {AppError} from '../../reference-app/src/middlewares-$id/app-error.js';
import {metadata} from '../../reference-app/src/mappers-$id/api-response.js';
import {w6Success,w6ErrorHandler} from '../../recipes/w6-response.js';
export function createBooksApp(db){
 const app=express(),service=booksService(booksRepository(db));app.use(express.json());
 const base='/api/demo002/books';
 app.get(base,queryParser,async(req,res)=>{const {items,total}=await service.list(req.pagination);res.json({status:'success',data:items,pagination:metadata(total,req.pagination)});});
 app.get(base+'/:code',async(req,res)=>w6Success(res,await service.get(req.params.code)));
 app.post(base,async(req,res)=>w6Success(res,await service.create(req.body),201));
 app.put(base+'/:code',async(req,res)=>w6Success(res,await service.update(req.params.code,req.body)));
 app.delete(base+'/:code',async(req,res)=>w6Success(res,await service.remove(req.params.code)));
 app.use((req,res,next)=>next(new AppError('Endpoint not found',404,'ENDPOINT_NOT_FOUND')));
 app.use(w6ErrorHandler);return app;
}
