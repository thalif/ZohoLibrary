import UserLog from "../Model/Userlog.js";
import LocalDB from "./localDB.js";
import Cookie from "./localCookie.js";
export default class UserDB
{
    GetUserDatabase()
    {
        const fromJSON = JSON.parse(localStorage.getItem('userDB'));
        if(fromJSON != null)
        {
            let UserDatabase = new Map(Object.entries(fromJSON));
            return UserDatabase;
        }
        else {
            return new Map();
        }
    }
    UpdateUserDB(UserDatabase)
    {
        localStorage.removeItem('userDB');
        var obj = Object.fromEntries(UserDatabase);
        var jsonString = JSON.stringify(obj);
        localStorage.setItem('userDB', jsonString);
    }

    AddNewUser(newUser)
    {
        let UserDatabase = this.GetUserDatabase();
        if(!UserDatabase.has(newUser.UserName))
        {
            UserDatabase.set(newUser.UserName, newUser);
            this.UpdateUserDB(UserDatabase);
        }
        else
        {
            throw "User already exist";
        }
    }
    DeleteUser(user)
    {
        // 1. Check user have to return book
        // 2. Clear local cookie and log out
        try
        {
            let ld = new LocalDB();
            let BookLogDB =  ld.GetBookLogDatabase();
            
            if(BookLogDB.has(user.UserName))
            {
                let Userlogs = BookLogDB.get(user.UserName);
                let len = Userlogs.length;
                return `User should must return ${len} books first!`;
            }
            else
            {
                let cookie = new  Cookie();
                cookie.DeleteCookie('cuser');

                let UserDatabase = this.GetUserDatabase();
                UserDatabase.delete(user.UserName);
                this.UpdateUserDB(UserDatabase);
                return '';
            }
        }
        catch(exception)
        {
            throw "Something went wrong!";
        }
    }

    
    GetUserLogInfo()
    {
        try
        {
            let UserLogInfo = JSON.parse(localStorage.getItem('userLogDB'));
            if(UserLogInfo ==  null)
                UserLogInfo = [];
            return UserLogInfo;
        }
        catch (exception) {
            return new Array();
        }
    }
    UpdateUserLogInfo(userloged)
    {
        if(userloged)
        {
            let loggedUser = new  UserLog();
            loggedUser.FullName = userloged.FullName;
            loggedUser.UserName = userloged.UserName;
            loggedUser.Gender = userloged.Gender;
            loggedUser.LogTime = new Date();

            let UserLogInfo = this.GetUserLogInfo();
            UserLogInfo.push(loggedUser);

            localStorage.removeItem('userLogDB');
            localStorage.setItem('userLogDB', JSON.stringify(UserLogInfo));
        }
    }
}