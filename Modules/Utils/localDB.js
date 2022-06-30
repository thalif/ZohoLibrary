export default class localDB
{
    Load_Genres()
    {
        try
        {
            let GenreList = JSON.parse(localStorage.getItem('genreItems'));
            return GenreList;
        }
        catch(exception)
        {
            throw exception;
        }
    }
    Load_Country()
    {
        try
        {
            let CountryList = JSON.parse(localStorage.getItem('countryDB'));
            return CountryList;
        }
        catch(exception)
        {
            throw exception;
        }
    }
    Load_Language()
    {
        try
        {
            let CountryList = JSON.parse(localStorage.getItem('languageItem'));
            return CountryList;
        }
        catch(exception)
        {
            throw exception;
        }
    }
    LoadBookDatabase()
    {
        const fromJSON = JSON.parse(localStorage.getItem('bookDB'))
        if (fromJSON != null) 
        {
            let BookDatabase = new Map(Object.entries(fromJSON));
            return BookDatabase;
        }
        else {
            return new Map();
        }
    }
    SetBookDatabase(BookDatabase)
    {
        try
        {
            // Remove existing data
            localStorage.removeItem('bookDB');

            // Update with new Data
            var obj = Object.fromEntries(BookDatabase);
            var jsonString = JSON.stringify(obj);
            localStorage.setItem('bookDB', jsonString);
            return true;
        }
        catch
        {
            return false;
        }
    }
    GetBookLogDatabase()
    {

        const fromJSON = JSON.parse(localStorage.getItem('bookLogDB'));
        if(fromJSON === null)
        {
            return new Map();
        }
        else
        {
            let bookLogMaster = new Map(Object.entries(fromJSON));
            return bookLogMaster;
        }
        // let get = typeof(localStorage.getItem("bookLogDB"));
        // if(get === 'undefined'){
        //     alert('no');
        // };
        // try {
        //     const fromJSON = JSON.parse(localStorage.getItem('bookLogDB'))
        //     let bookLogMaster = new Map(Object.entries(fromJSON));
        //     return bookLogMaster;

        // }
        // catch (exception) {
        //     return new Map();
        // }
    }
    SetBookLogDatabase(bookLogMaster)
    {
        localStorage.removeItem('bookLogDB');

        var obj = Object.fromEntries(bookLogMaster);
        var jsonString = JSON.stringify(obj);
        localStorage.setItem('bookLogDB', jsonString);
    }

    DeleteBook(selectedItem)
    {
        const fromJSON = JSON.parse(localStorage.getItem('bookDB'));
        if(fromJSON != null)
        {
            let BookDatabase = new Map(Object.entries(fromJSON));
            if(BookDatabase.has(selectedItem.ISBN))
            {
                // Delete item.
                BookDatabase.delete(selectedItem.ISBN)

                // Update database.
                this.SetBookDatabase(BookDatabase);
            }
            else
            {
                throw "Invalid operation: There is no such book ";
            }
        }
        else
        {
            throw "Invalid Operation : There is no book in database.";
        }
    }


    LoadUserDB()
    {
        try
        {
            const fromJSON = JSON.parse(localStorage.getItem('userDB'))
            let UserkDatabase = new Map(Object.entries(fromJSON));
            return UserkDatabase;
        }
        catch(exception) { throw exception; }
    }

    GetUserLogDB()
    {
        let userLog = JSON.parse(localStorage.getItem('userLogDB'));
        if (userLog != null)
            return Array.from(userLog);
        else
            return new Array();
    }

    UpdateFineColleciton(thisUser, thisBook, fineAmount)
    {
        let JSONObject = 
        {
            "Username" : thisUser.UserName,
            "BookId" : thisBook.BookId,
            "FineAmount" : fineAmount
        };

        let FineRecord = this.GetFineReocrd();
        FineRecord.push(JSONObject);
        localStorage.setItem('returnRecord', JSON.stringify(FineRecord));
    }

    GetFineReocrd()
    {
        try
        {
            let record = JSON.parse(localStorage.getItem('returnRecord'))
            return Array.from(record);
        }
        catch
        {
            return new Array();
        }
    }
}