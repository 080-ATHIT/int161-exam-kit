import express from 'express';
import {numericId} from '../services-$id/catalog-service.js';
import {queryParser} from '../middlewares-$id/pagination.js';
import {success,metadata} from '../mappers-$id/api-response.js';
// Express 5 ส่ง rejected Promise จาก async handler เข้า error middleware ได้
export function createCatalogRouter(service,identity) {
 const router=express.Router();
 router.get('/student-info',(req,res)=>success(res,{studentId:identity.studentId,name:identity.name,secretKey:identity.key}));
 router.get('/brands',async(req,res)=>success(res,await service.listBrands()));
 router.get('/brands/:id',async(req,res)=>success(res,await service.getBrand(numericId(req.params.id))));
 router.delete('/brands/:id',async(req,res)=>{await service.removeBrand(numericId(req.params.id));res.status(204).end();});
 router.get('/products',queryParser,async(req,res)=>{const {items,total}=await service.listProducts(req.pagination);return success(res,items,200,metadata(total,req.pagination));});
 router.get('/products/:id',async(req,res)=>success(res,await service.getProduct(numericId(req.params.id))));
 router.post('/products',async(req,res)=>success(res,await service.createProduct(req.body),201));
 router.put('/products/:id',async(req,res)=>success(res,await service.updateProduct(numericId(req.params.id),req.body)));
 router.delete('/products/:id',async(req,res)=>{await service.removeProduct(numericId(req.params.id));res.status(204).end();});
 // ตัวอย่าง string key: ไม่ใช้ Number(req.params.code)
 router.get('/tags',async(req,res)=>success(res,await service.listTags()));
 router.get('/tags/:code',async(req,res)=>success(res,await service.getTag(req.params.code)));
 router.post('/tags',async(req,res)=>success(res,await service.createTag(req.body),201));
 router.put('/tags/:code',async(req,res)=>success(res,await service.updateTag(req.params.code,req.body)));
 router.delete('/tags/:code',async(req,res)=>{await service.removeTag(req.params.code);res.status(204).end();});
 // Composite key = product_id + tag_code: ต้องส่งครบทั้งคู่
 router.get('/products/:id/tags',async(req,res)=>success(res,await service.listProductTags(numericId(req.params.id))));
 router.post('/products/:id/tags',async(req,res)=>success(res,await service.createProductTag(numericId(req.params.id),req.body),201));
 router.delete('/products/:id/tags/:code',async(req,res)=>{await service.removeProductTag(numericId(req.params.id),req.params.code);res.status(204).end();});
 return router;
}
