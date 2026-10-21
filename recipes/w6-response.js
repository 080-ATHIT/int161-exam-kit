// Copy into the teacher mapper/middleware file; adjust this import to its new path.
import {normalizeError} from '../src/middlewares-$id/error-handler.js';
export function w6Success(res,data,status=200){return res.status(status).json({status:'success',data});}
export function w6ErrorHandler(err,req,res,next){
 if(res.headersSent)return next(err);
 const result=normalizeError(err);
 return res.status(result.status).json({status:'error',error:result.body.error});
}
