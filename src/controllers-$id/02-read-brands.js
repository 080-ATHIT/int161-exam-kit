// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Read 1: SELECT brands ORDER BY id → 200 array
import {success} from '../mappers-$id/api-response.js';

export function readBrandsHandler(service) {
  return async function (req, res) {
    return success(res, await service.listBrands());
  };
}
