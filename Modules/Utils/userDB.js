import UserLog from "../Model/Userlog.js";
export default class UserDB
{
    constructor()
    {
        this.UserDatabase = new Map();
        this.UserLogInfo = new Array();
        this.GetUserDatabase();
        this.GetUserLogInfo();
    }
    GetUserDatabase()
    {
        try
        {
            const fromJSON = JSON.parse(localStorage.getItem('userDB'));
            this.UserDatabase = new Map(Object.entries(fromJSON));
            return this.UserDatabase;
        }
        catch(exception)
        {
            this.UserDatabase = new Map();
            return this.UserDatabase;
        }
    }
    GetUserLogInfo()
    {
        try
        {
            this.UserLogInfo = JSON.parse(localStorage.getItem('userLogDB'))
            if(this.UserLogInfo ==  null)
                this.UserLogInfo = [];
            return this.UserLogInfo;
        }
        catch(exception)
        {
            this.UserLogInfo = [];
            return this.UserLogInfo;
        }
    }

    AddNewUser(newUser)
    {
        if(!this.UserDatabase.has(newUser.UserName))
        {
            this.UserDatabase.set(newUser.UserName, newUser);
            localStorage.removeItem('userDB');

            var obj = Object.fromEntries(this.UserDatabase);
            var jsonString = JSON.stringify(obj);
            localStorage.setItem('userDB', jsonString);
        }
        else
        {
            throw "User already exist";
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

            this.UserLogInfo.push(loggedUser);
            localStorage.removeItem('userLogDB');
            localStorage.setItem('userLogDB', JSON.stringify(this.UserLogInfo));
        }
    }
}