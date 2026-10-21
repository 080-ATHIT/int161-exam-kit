// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Create: validate/allowlist → INSERT → SELECT detail DTO → 201
import {success} from '../mappers-$id/api-response.js';

export function createProductHandler(service) {
  return async function (req, res) {
    return success(res, await service.createProduct(req.body), 201);
  };
}
