import User from "./Model/User.js";
import LocalCookie from "./Utils/localCookie.js";
import UserDB from "./Utils/userDB.js";

const UserDatabase = new UserDB();
const cookie = new LocalCookie();
let ContextUser = new User();
window.onload = (event) =>
{
    ContextUser = GetUserFromCookie();
    if(ContextUser)
    {
        Redirect(ContextUser);
    }
}

document.getElementById('login-btn').addEventListener('click', function()
{
    Login();
});

function Login()
{
    try
    {
        let usernameEntered = document.getElementById('username-box').value;
        let passwordEntered = document.getElementById('password-box').value;

        if(usernameEntered)
        {
            let db = UserDatabase.GetUserDatabase();
            if(db.has(usernameEntered))
            {
                ContextUser = db.get(usernameEntered);
                if(ContextUser.Password == passwordEntered)
                {
                    UserDatabase.UpdateUserLogInfo(ContextUser);
                    cookie.SetCookie('cuser', ContextUser.UserName, 10);
                    Redirect(ContextUser);
                }
                else
                {
                    document.getElementById('error-msg').innerHTML = 'Invalid Credentials.';
                    document.getElementById('error-block').style.display = 'block';
                }
            }
            else
            {
                document.getElementById('error-msg').innerHTML = 'User not found.';
                document.getElementById('error-block').style.display = 'block';
            }
        }
        else
        {
            document.getElementById('error-msg').innerHTML = 'Please enter valid username';
            document.getElementById('error-block').style.display = 'block';
        }
    }
    catch(exception)
    {
        console.log(exception);
    }
}
function GetUserFromCookie()
{
    try
    {
        if (cookie.CheckCookie()) {
            let db = UserDatabase.GetUserDatabase();
            if (db.has(cookie.GetCookie('cuser'))) {
                return db.get(cookie.GetCookie('cuser'));
            }
        }
        else
            return false;
    }
    catch { return false; }
}

function Redirect(user)
{
    if(user.IsAdmin)
        window.location.href = "admin.html";
    else
        window.location.href = "userpage.html";
}

