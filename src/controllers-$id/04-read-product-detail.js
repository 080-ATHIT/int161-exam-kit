// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Read 3: validate id → SELECT JOIN → missing404 → detail DTO
import {success} from '../mappers-$id/api-response.js';
import {numericId} from '../services-$id/catalog-service.js';

export function readProductDetailHandler(service) {
  return async function (req, res) {
    return success(res, await service.getProduct(numericId(req.params.id)));
  };
}
