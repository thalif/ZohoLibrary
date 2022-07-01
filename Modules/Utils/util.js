export default class LibUtil
{
    constructor()
    {
        this.FINE_AMOUNT = 12;
        this.MIN_BOOK_PICK_DAY = 10;
    }
    GetFineAmount(date1, date2)
    {
        let totalDays = this.GetDiff(date1, date2);
        if(totalDays > this.MIN_BOOK_PICK_DAY)
            return (totalDays - this.MIN_BOOK_PICK_DAY) * this.FINE_AMOUNT;
        else
            return 0;
    }
    GetDiff(date1, date2) 
    {
        let dt1 = new Date(date1);
        let dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
    }
}