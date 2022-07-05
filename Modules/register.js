import User from './Model/User.js';
import UserDB from './Utils/userDB.js';

let userDB = new UserDB();
let newUser = new User();
let UserDatabase = new Map();
window.onload = (event) => 
{
    ResetAllFields();
    UserDatabase = userDB.GetUserDatabase();
    ValidateCheck();
}
document.getElementById('submit-btn').addEventListener('click', function()
{
    Register();
});
document.getElementById('reset-btn').addEventListener('click', function()
{
    ResetAllFields();
});
function ValidateCheck()
{
    let userNameEntered = document.getElementById('username-box').value;
    if(UserDatabase.has(userNameEntered))
        throw `${userNameEntered} has already taken. Please provide different username.`
    
    let userEmailEntered = document.getElementById('email-box').value;
    let userMobileEntered = document.getElementById('mobile-box').value;

    let UserDatas = Array.from(UserDatabase.values());
    UserDatas.forEach((item) => {

        if(item.Email == userEmailEntered)
            throw `${userEmailEntered} has been already registerd.`
        else if(item.Mobile == userMobileEntered)
            throw `${userMobileEntered} has been already registerd`;
    });
    return true;
}

function Register()
{
    function GetNewID()
    {
        try { return UserDatabase.size + 1; }
        catch(e) { return 1; }
    }
    try
    {  
        ValidateCheck();
        newUser.ID = GetNewID();
        newUser.setFullName(document.getElementById('fullname-box').value);
        newUser.setUserName(document.getElementById('username-box').value);
        newUser.setDateofBirth(document.getElementById('dob-box').value);
        newUser.setGender(document.getElementById('gender-combo').value);
        newUser.setEmailId(document.getElementById('email-box').value);
        newUser.setMobileNumber(document.getElementById('mobile-box').value);
        newUser.setPassword(document.getElementById('password-box1').value, document.getElementById('password-box2').value);
        newUser.IsAdmin = false;

        userDB.AddNewUser(newUser);
        UserDatabase = userDB.GetUserDatabase();

        ResetAllFields();
        window.location.href = './index.html';

    }
    catch(exception)
    {
        document.getElementById('error-block').style.display = 'flex';
        document.getElementById('er').innerHTML = exception;
        console.log(exception);
    }
}

function ResetAllFields()
{
    document.getElementById('fullname-box').value = '';
    document.getElementById('username-box').value = '';
    document.getElementById('dob-box').value = '';
    document.getElementById('gender-combo').value = '';
    document.getElementById('mobile-box').value = '';
    document.getElementById('email-box').value = '';
    document.getElementById('password-box1').value = '';
    document.getElementById('password-box2').value = '';
    document.getElementById('er').innerHTML = '';
}