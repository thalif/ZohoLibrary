export default class Book
{
    constructor()
    {
        this.ISBN;
        this.BookTitle;
        this.Edition;
        this.Genre = [];
        this.Authuors = [];
        this.Language;
        this.DateOfPublished;
        this.Publisher;
        this.PublisherContact;
        this.Origin;
        this.CoverImage;
        //
        this.Section;
        this.Rack;
        this.StockCount;
    }

    SetBookTitle(bookTitle)
    {
        if(bookTitle === '')
            throw "Book must have Title.!";
        else
            this.BookTitle = bookTitle;
    }
    SetISBN(isbn)
    {
        if(isbn === '')
            throw "ISB number must be provided.";
        else
            this.ISBN = isbn;
    }
    SetEdition(edition)
    {
        if(edition === '')
            throw 'A book can have edition. If not, then simply enter 1.';
        else
            this.Edition = edition;
    }
    SetLanguage(language)
    {
        if(language === '')
            throw 'Please select book language';
        else
            this.Language = language;
    }
    AddGenre(genre)
    {
        if(genre === '')
            throw 'Select atleast 1 genre or select other.';
        else if(this.Genre.includes(genre))
            throw `${genre} is already added.!`;
        else
            this.Genre.push(genre);
    }
    RemoveGenre(index)
    {
        if(index !== '')
        {
            this.Genre.splice(index, 1);
        }
    }
    AddAuthours(authour)
    {
        if(authour === '')
            throw "Book must have authour";
        else if(this.Authuors.includes(authour))
            throw `${authour} already added.!`;
        else
            this.Authuors.push(authour);   
    }
    RemoveAuthorItem(index)
    {
        // const index = this.Authuors.findIndex((element) => element === item);
        if(index !== '')
        {
            this.Authuors.splice(index, 1);
        }
    }

    SetPublisher(publisher)
    {
        if(publisher === '')
            throw "Publisher cannot be empty.!";
        else
            this.Publisher = publisher;
    }
    SetPublisherContact(publisherContact)
    {
        if(publisherContact === '')
            throw "Publisher contact cannon be empty";
        else
            this.PublisherContact = publisherContact;
    }
    SetPublisedDate(date)
    {
        if(date === '')
            throw 'Publised date cannot be empty';
        else
            this.DateOfPublished = date;
    }
    SetOrigin(origin)
    {
        if(origin === '')
            throw "Please select book origin.";
        else
            this.Origin = origin;
    }
    SetSection(section)
    {
        if(section === '')
            throw 'Section box is empty.';
        else
            this.Section = section;
    }
    SetRack(rack)
    {
        if(rack === '')
            throw 'Rack box is empty.!';
        else
            this.Rack = rack;
    }
    SetStockCount(stockCount)
    {
        if(stockCount === '')
            throw 'Stock must have atleast 1.';
        else
            this.StockCount = stockCount;
    }
}