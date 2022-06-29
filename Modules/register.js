import User from './Model/User.js';
import localDB from './Utils/userDB.js';

let local = new localDB();
let newUser = new User();
let UserDatabase;
window.onload = (event) => 
{
    ResetAllFields();
}
document.getElementById('submit-btn').addEventListener('click', function()
{
    Register();
});

function Register()
{
    function GetNewID()
    {
        try { return local.GetUserDatabase().size + 1; }
        catch(e) { return 1; }
    }
    try
    {   
        newUser.ID = GetNewID();
        newUser.setFullName(document.getElementById('fullname-box').value);
        newUser.setUserName(document.getElementById('username-box').value);
        newUser.setDateofBirth(document.getElementById('dob-box').value);
        newUser.setGender(document.getElementById('gender-combo').value);
        newUser.setEmailId(document.getElementById('email-box').value);
        newUser.setMobileNumber(document.getElementById('mobile-box').value);
        newUser.setPassword(document.getElementById('password-box1').value, document.getElementById('password-box2').value);
        newUser.IsAdmin = false;
        local.AddNewUser(newUser);
        UserDatabase = local.GetUserDatabase();
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
}