export default class LocalCookie
{
    constructor()
    {
        this.MIN_DAYS_COOKIE_SET = 30;
    }
    CheckCookie()
    {
        let cookieValue = this.GetCookie('cuser');

        if (cookieValue)
            return true;
        else
            return false;
    }
    
    DeleteCookie(cookieName)
    {
        document.cookie = cookieName +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    
    SetCookie(cname, cvalue, exdays) 
    {
        const d = new Date();
        d.setDate(d.getDate() + this.MIN_DAYS_COOKIE_SET);
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
  
    GetCookie(cname) 
    {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}