// ADAPT: เปลี่ยนenvelopeเฉพาะตามcontract: success/data/timestamp หรือ status/data
// DELETE204ไม่ผ่านhelperนี้ ใช้end(); DELETE200จึงส่งJSONตามสเปก
// ตัวอย่าง W8-like: ปรับชื่อ key/types/status ตามข้อสอบจริงเสมอ
export function success(res, data, status = 200, pagination) {
  return res.status(status).json({success:true, data,
    ...(pagination ? {pagination} : {}), timestamp:new Date().toISOString()});
}
export function metadata(total, {page,limit}) {
  return {total:Number(total),page,limit,totalPages:Math.ceil(total/limit),hasNextPage:page*limit<total,hasPrevPage:page>1};
}
