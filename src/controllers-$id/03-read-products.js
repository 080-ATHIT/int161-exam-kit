// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Read 2: queryParser must run first; list + COUNT → summary DTO + pagination
import {success, metadata} from '../mappers-$id/api-response.js';

export function readProductsHandler(service) {
  return async function (req, res) {
    const {items, total} = await service.listProducts(req.pagination);
    return success(res, items, 200, metadata(total, req.pagination));
  };
}
