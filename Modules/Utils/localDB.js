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
        try
        {
            const fromJSON = JSON.parse(localStorage.getItem('bookDB'))
            let BookDatabase = new Map(Object.entries(fromJSON));
            return BookDatabase;
        }
        catch(exception) 
        {
            throw exception;
        }
    }
    SetBookDatabase(BookDatabase)
    {
        try
        {
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
        try {
            const fromJSON = JSON.parse(localStorage.getItem('bookLogDB'))
            let bookLogMaster = new Map(Object.entries(fromJSON));
            return bookLogMaster;

        }
        catch (exception) {
            return new Map();
        }
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
        let BookDatabase = new Map(Object.entries(fromJSON));
        BookDatabase.delete(selectedItem.ISBN)

        let bookDB_Name = 'bookDB';
        localStorage.removeItem(bookDB_Name);
        
        var obj = Object.fromEntries(BookDatabase);
        var jsonString = JSON.stringify(obj);
        localStorage.setItem(bookDB_Name, jsonString);
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