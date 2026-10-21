// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Update: find first, full-body validation, UPDATE then read back; unchanged values200
import {success} from '../mappers-$id/api-response.js';
import {numericId} from '../services-$id/catalog-service.js';

export function updateProductHandler(service) {
  return async function (req, res) {
    return success(res, await service.updateProduct(numericId(req.params.id), req.body));
  };
}
