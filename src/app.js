// ADAPT: base path คงที่ตามรหัสใน .env; เปลี่ยน resource/router เมื่อโจทย์ใช้ตารางอื่น
import express from 'express';
import {createCatalogRepository} from './repositories-$id/catalog-repository.js';
import {createCatalogService} from './services-$id/catalog-service.js';
import {createCatalogRouter} from './routes-$id/catalog-route.js';
import {errorHandler} from './middlewares-$id/error-handler.js';
import {AppError} from './middlewares-$id/app-error.js';
export function createApp({db,studentId,name,key}) {
 if(!/^[A-Za-z0-9_-]{1,32}$/.test(studentId))throw new Error('Invalid static student ID');
 const app=express();app.disable('x-powered-by');app.use(express.json());
 const repo=createCatalogRepository(db),service=createCatalogService(repo);
 app.use(`/api/${studentId}`,createCatalogRouter(service,{studentId,name,key}));
 app.use((req,res,next)=>next(new AppError('Endpoint not found',404,'ENDPOINT_NOT_FOUND')));
 app.use(errorHandler);
 return app;
}
