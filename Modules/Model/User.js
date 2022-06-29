export default class User
{
    constructor()
    {
        this.ID;
        this.FullName;
        this.UserName;
        this.DOB;
        this.Gender;
        this.Email;
        this.Mobile;
        this.Password;
        this.IsAdmin;
        
        this.BooksList =[];
    }
    setFullName(fullname)
    {
        var regFullName = /[A-Za-z\ ]{2,25}/gm;
        if(!fullname)
            throw "Fullname cannot be empty";
        else if(regFullName.test(fullname))
            this.FullName = fullname;
        else
            throw "Please provide valid user's fullname.";
    }
    setUserName(username)
    {
        var regUserName = /[a-z]{2,25}/gm;
        if(!username)
            throw "Username cannot be empty";
        else if(regUserName.test(username))
            this.UserName = username;
        else
            throw "Please provide valid username.";
    }

    setDateofBirth(dob)
    {
        let data = dob.split("-");
        const date = new Date(data[0], data[1], data[2]);
        let user = date.getFullYear();

        const today = new Date();
        let zoho = today.getFullYear() - 18;
        
        if(user > zoho)
            throw "Age should be above 18."
        else
            this.DOB = date;
    }

    setGender(gender)
    {
        if(gender)
            this.Gender = gender;
        else
            throw "Please select gender";
    }
    setMobileNumber(mobile) 
    {
        var regMobile = /^[9,8,7,6]{1}[0-9]{9}/gm
        if(!mobile)
            throw 'Enter your mobile number';
        // else if(userDatabase.findIndex(o => o.Mobile == mobile) >= 0)
        //     throw 'This mobile number is already exist..!';
        // else if(regMobile.test(mobile))
        //     throw 'Please provide a valid mobile number';
        else
            this.Mobile = mobile;
    }
    setEmailId(email)
    {
        var regEmail = /^[a-z0-9/.-]{1,25}[@]{1}[a-z]{2,10}[/.]{1}[a-z]{4}/gm
        if(!email)
            throw "Please provide email ID";
        // else if(userDatabase.findIndex(o => o.Email == email) >= 0)
        //     throw 'This user email is already exist..!';
        else if(regEmail.test(email))
            throw 'Provide a valid email Id';
        else
            this.Email = email;
    }
    setPassword(password1, password2)
    {
        // 1. Regex validation
        if(!password1)
            throw 'You have to choose your password';
        else if(!password2)
            throw 'Retype the password';
        if(password1 != password2)
            throw 'Provided password does not match';
        else
            this.Password = password1;
    }
}
