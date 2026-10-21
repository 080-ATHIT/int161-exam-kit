export const bookSummary=e=>({code:e.book_code,title:e.title,fee:Number(e.daily_fee)});
export const bookDetail=e=>({...bookSummary(e),author:e.author});
