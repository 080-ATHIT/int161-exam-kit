// ADAPT: เปลี่ยน method/path ให้ตรงข้อสอบ; controllers รับreq/res, serviceถือbusinesslogic
import express from 'express';
import {numericId} from '../services-$id/catalog-service.js';
import {queryParser} from '../middlewares-$id/pagination.js';
import {success} from '../mappers-$id/api-response.js';
import {createProductHandler} from '../controllers-$id/01-create-product.js';
import {readBrandsHandler} from '../controllers-$id/02-read-brands.js';
import {readProductsHandler} from '../controllers-$id/03-read-products.js';
import {readProductDetailHandler} from '../controllers-$id/04-read-product-detail.js';
import {updateProductHandler} from '../controllers-$id/05-update-product.js';
import {deleteProductHandler} from '../controllers-$id/06-delete-product.js';
// Express 5 ส่ง rejected Promise จาก async handler เข้า error middleware ได้
export function createCatalogRouter(service,identity) {
 const router=express.Router();
 router.get('/student-info',(req,res)=>success(res,{studentId:identity.studentId,name:identity.name,secretKey:identity.key}));
 router.get('/brands',readBrandsHandler(service));
 router.get('/brands/:id',async(req,res)=>success(res,await service.getBrand(numericId(req.params.id))));
 router.delete('/brands/:id',async(req,res)=>{await service.removeBrand(numericId(req.params.id));res.status(204).end();});
 router.get('/products',queryParser,readProductsHandler(service));
 router.get('/products/:id',readProductDetailHandler(service));
 router.post('/products',createProductHandler(service));
 router.put('/products/:id',updateProductHandler(service));
 router.delete('/products/:id',deleteProductHandler(service));
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
