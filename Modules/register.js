import User from './Model/User.js';
import UserDB from './Utils/userDB.js';

let userDB = new UserDB();
let newUser = new User();
let UserDatabase = new Map();
window.onload = (event) => 
{
    ResetAllFields();
    UserDatabase = userDB.GetUserDatabase();
}
document.getElementById('submit-btn').addEventListener('click', function()
{
    Register();
});
document.getElementById('reset-btn').addEventListener('click', function()
{
    ResetAllFields();
});
function ValidateWithExistingRecord()
{
    // Check username is already taken.
    let userNameEntered = document.getElementById('username-box').value;
    if(UserDatabase.has(userNameEntered))
        throw `${userNameEntered} has already taken. Please provide different username.`
    
    // Check Email and Mobile number is already existing or not.
    let userEmailEntered = document.getElementById('email-box').value;
    let userMobileEntered = document.getElementById('mobile-box').value;
    let UserDatas = Array.from(UserDatabase.values());
    UserDatas.forEach((item) => {

        if(item.Email == userEmailEntered)
            throw `${userEmailEntered} has been already registerd.`
        else if(item.Mobile == userMobileEntered)
            throw `${userMobileEntered} has been already registerd.`;
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
        // 1. Validate user data with our existing Database [ Username | Mobile | Email ]
        ValidateWithExistingRecord();

        newUser.ID = GetNewID();
        newUser.setFullName(document.getElementById('fullname-box').value);
        newUser.setUserName(document.getElementById('username-box').value);
        newUser.setDateofBirth(document.getElementById('dob-box').value);
        newUser.setGender(document.getElementById('gender-combo').value);
        newUser.setEmailId(document.getElementById('email-box').value);
        newUser.setMobileNumber(document.getElementById('mobile-box').value);
        newUser.setPassword(document.getElementById('password-box1').value, document.getElementById('password-box2').value);
        newUser.IsAdmin = false;

        // 2. Update database with new user.
        userDB.AddNewUser(newUser);
        UserDatabase = userDB.GetUserDatabase();

        // 3. Reset all fields.
        ResetAllFields();
        window.location.href = './index.html';

    }
    catch(exception)
    {
        ShowError(exception);
    }
}
function ShowError(message)
{
    document.getElementById('error-block').style.display = 'flex';
    document.getElementById('er').innerHTML = message;
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