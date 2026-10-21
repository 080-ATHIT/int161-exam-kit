// ADAPT: จับคู่HTTPstatus/errorcode/message/envelopeกับโจทย์จริง รวมMySQL1062/1452/1451
import { AppError } from './app-error.js';
const MYSQL_ERRORS = {
  ER_DUP_ENTRY: [409,'DUPLICATE_KEY','Resource already exists'],
  ER_NO_REFERENCED_ROW_2: [400,'FOREIGN_KEY_NOT_FOUND','Referenced record does not exist'],
  ER_ROW_IS_REFERENCED_2: [409,'RESOURCE_IN_USE','Resource is referenced by another record'],
};
export function normalizeError(err) {
  const mysql = MYSQL_ERRORS[err?.code];
  const [status, code, message] = mysql || (err instanceof AppError
    ? [err.status, err.code, err.message]
    : err?.type === 'entity.parse.failed' ? [400,'INVALID_JSON','Request body must be valid JSON']
    : [500,'INTERNAL_SERVER_ERROR','Internal server error']);
  return {status,body:{success:false,error:{code,message},timestamp:new Date().toISOString()}};
}
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const result = normalizeError(err);
  return res.status(result.status).json(result.body);
}
