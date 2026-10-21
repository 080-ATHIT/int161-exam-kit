// ADAPT: controller ที่ใช้ได้แล้ว เปลี่ยนparams/body/statusตามโจทย์ และแก้service/repo/mapperที่เกี่ยวข้อง
// Delete: find404 or DELETE; 204 has NO JSON body
import {numericId} from '../services-$id/catalog-service.js';

export function deleteProductHandler(service) {
  return async function (req, res) {
    await service.removeProduct(numericId(req.params.id));
    return res.status(204).end();
  };
}
