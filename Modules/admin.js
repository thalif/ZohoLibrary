import Book from "./Model/Book.js";
import localDB from "./Utils/localDB.js";
import UserDB from "./Utils/userDB.js";
import Cookie from "./Utils/localCookie.js";
import Util from "./Utils/util.js";


let ld = new localDB();
let util = new Util();
let userDB = new UserDB();
let cookie = new Cookie();

let genreDB;
let countryDB;
let languageDB;

let UserDatabase = new Map();
let BookDatabase = new Map();
let thisBook = new Book();
let UserLogList = [];

let ContextUser;
let SelectedBookItem = new Book();

// filter 
let AuthourMaster = [];
let SelectedGenreList = [];
let SelectedAuthours = [];

window.onload = (event) =>
{
    try
    {   
        PageConstructor();
        LoadInitialsForPageContext();
    }
    catch (exception) {
        ShowErrorAlert(exception);
    }
}

//===========[ Constructor Methods ]=====================================================
// ======================================================================================
function PageConstructor()
{
    BookDatabase = ld.LoadBookDatabase();
    AuthourMaster = GetDistinctAuthoursList(Array.from(BookDatabase.values()));
    UserDatabase = userDB.GetUserDatabase();
    VerifyCookieDetails();
    InvokeDashboadContext();
    // Initial New Book Form
    Show_NewBook_UI();
}
function VerifyCookieDetails()
{
    ContextUser = GetUserFromCookie();
    if(ContextUser)
    {
        document.getElementById('user-name').innerHTML = ContextUser.FullName;
        MenuNavigate(4);
    }
    else {
        window.location.href = "./index.html";
    }
}
function LoadInitialsForPageContext()
{
    

    // Load Genre DB
    genreDB = ld.Load_Genres();
    if (genreDB)
    {
        Load_Genres(genreDB);
        InitGenre(genreDB);
    }
        
    // Loan Country DB
    countryDB = ld.Load_Country();
    if (countryDB)
        Load_Countries(countryDB);

    // Load Languages DB
    languageDB = ld.Load_Language();
    if (languageDB)
        Load_Language(languageDB);
}
function Load_Genres(genreList)
{
    let genreCombo = document.getElementById('genre-combo');
    genreCombo.innerHTML = `${genreList.map((genre) => `<option>${genre}</option>` ).join(',')}`; 
    document.getElementById('genre-combo').value = '';
}
function Load_Language(languageList)
{
    let langCombo = document.getElementById('language-combo');
    langCombo.innerHTML = `${languageList.map((lang) => `<option>${lang}</option>` ).join(',')}`;
    document.getElementById('language-combo').value = '';
}
function Load_Countries(countryList)
{
    let countryCombo = document.getElementById('book-origin-combo');
    countryCombo.innerHTML = `${countryList.map((con) => `<option>${con}</option>` ).join(',')}`;
    document.getElementById('book-origin-combo').value = '';
}
// =======[ Load genre combo for filter panel ]==========
function InitGenre(genreList)
{
    let genreCombo = document.getElementById('genre-filter-combo');
    genreCombo.innerHTML = `${genreList.map((genre) => `<option>${genre}</option>` ).join('')}`;
    genreCombo.value = '';
}
// ========[ Menu Navigations ]===================
function MenuNavigate(s)
{
    switch(s)
    {
        case 1:
            document.getElementById('admin-dashboard').style.display = 'none';
            document.getElementById('bookform-block').style.display = 'block';
            document.getElementById('show-book-block').style.display = 'none';
            document.getElementById('show-user-block').style.display = 'none';
            SelectedMenuStyle('menu-dashboard');
            UndoMenuButtonStyle('menu-add-newbook');
            SelectedMenuStyle('menu-show-allbook');
            SelectedMenuStyle('menu-show-allusers');
            break;
        case 2:
            document.getElementById('admin-dashboard').style.display = 'none';
            document.getElementById('bookform-block').style.display = 'none';
            document.getElementById('show-book-block').style.display = 'block';
            document.getElementById('show-user-block').style.display = 'none';
            Refresh_BookList_UI(BookDatabase);
            SelectedMenuStyle('menu-dashboard');
            SelectedMenuStyle('menu-add-newbook');
            UndoMenuButtonStyle('menu-show-allbook');
            SelectedMenuStyle('menu-show-allusers');
            break;
        case 3:
            document.getElementById('admin-dashboard').style.display = 'none';
            document.getElementById('bookform-block').style.display = 'none';
            document.getElementById('show-book-block').style.display = 'none';
            document.getElementById('show-user-block').style.display = 'block';
            Refresh_UserList_UI();
            SelectedMenuStyle('menu-dashboard');
            SelectedMenuStyle('menu-add-newbook');
            SelectedMenuStyle('menu-show-allbook');
            UndoMenuButtonStyle('menu-show-allusers');
            break;
        case 4:
            document.getElementById('admin-dashboard').style.display = 'flex';
            document.getElementById('bookform-block').style.display = 'none';
            document.getElementById('show-book-block').style.display = 'none';
            document.getElementById('show-user-block').style.display = 'none';
            UndoMenuButtonStyle('menu-dashboard');
            SelectedMenuStyle('menu-add-newbook');
            SelectedMenuStyle('menu-show-allbook');
            SelectedMenuStyle('menu-show-allusers');
            break;
            
        default:
            break;
    }
}

// ========[ Event listener ]=============================================================
// ======================================================================================
//#region Even Listener

function SelectedMenuStyle(selectedButtonID)
{
    document.getElementById(selectedButtonID).style.backgroundColor = '#2C3639';
    document.getElementById(selectedButtonID).style.color = '#b9c7c8';
    document.getElementById(selectedButtonID).style.fontSize = 'large';
    document.getElementById(selectedButtonID).style.border = '0px';
}
function UndoMenuButtonStyle(buttonID)
{
    document.getElementById(buttonID).style.backgroundColor = '#d2d2d2';
    document.getElementById(buttonID).style.color = '#5e8089';
    document.getElementById(buttonID).style.fontSize = 'regular';
    document.getElementById(buttonID).style.border = '1px';
}

document.getElementById('menu-dashboard').addEventListener('click', function()
{
    MenuNavigate(4);
});
document.getElementById('menu-add-newbook').addEventListener('click', function()
{
    MenuNavigate(1);
    Show_NewBook_UI();
    ResetAllFields();
});
document.getElementById('menu-show-allbook').addEventListener('click', function()
{
    MenuNavigate(2);
    
});
document.getElementById('menu-show-allusers').addEventListener('click', function()
{
    MenuNavigate(3);
});


document.getElementById('genre-filter-combo').addEventListener('change', function(event)
{
    try
    {
        AddGenre();
        FindFilter();
    }
    catch (exception) {
        alert(exception);
    }
});
document.getElementById('authour-input-key').addEventListener('keyup', function()
{
    FindAuthour();
});

document.getElementById('logout-btn').addEventListener('click', function()
{
    Logout();
});
document.getElementById('add-authour-btn').addEventListener('click', function()
{
    AddNewAuthour();
});

document.getElementById('submit-btn').addEventListener('click', function()
{
    SubmitNewBook();
});
document.getElementById('update-btn').addEventListener('click', function()
{
    UpdateBookDetails();
});
document.getElementById('choose-img-btn').addEventListener('change', function()
{
    ChooseNewImage();
});
document.getElementById('genre-combo').addEventListener('change', function()
{
    AddNewGenre();
});

// ===========[ Selection block buttons - add event listener ]=====================
document.getElementById('close-selection-btn').addEventListener('click', function()
{
    document.getElementById('selection-action-block').style.display = 'none';
});

document.getElementById('update-book-btn').addEventListener('click', function()
{
    InvokUpdateBook(SelectedBookItem);
});
document.getElementById('delete-book-btn').addEventListener('click', function()
{
    DeleteSelectedItem(SelectedBookItem);
});
//#endregion

//================================================================================================================================
//=========[ Invoke Dahsboard ]===================================================================================================
//================================================================================================================================
function InvokeDashboadContext()
{
    SetTotalBooksCount();
    document.getElementById('total-customer-count').innerHTML = UserDatabase.size;
    SetTotalTransaction();
    SetBookTakenCount();
    SetFineAmountCollected();
    SetBookLateData();
}
function SetTotalTransaction()
{
    let BookReturnRecord = ld.GetBookReturnRecord();
    document.getElementById('total-transaction-count').innerHTML = BookReturnRecord.length;

    let todayCount = 0;
    BookReturnRecord.forEach((item) => {
        let bookDate = new Date(item.Date);
        let today = new Date();
        if(bookDate.getFullYear() === today.getFullYear() && bookDate.getMonth() === today.getMonth() && bookDate.getDay() === today.getDay())
        {
            todayCount++;
        }
    });
    document.getElementById('transaction-today').innerHTML = todayCount;
}
function SetTotalBooksCount()
{
    let count = 0;
    BookDatabase.forEach((item) => count += parseInt(item.StockCount));
    document.getElementById('total-book-count').innerHTML = count;
}
function SetBookTakenCount()
{
    let bookTakenLog = ld.GetBookLogDatabase();
    let count = 0;
    bookTakenLog.forEach((item) => item.forEach((i) => count++ ));
    document.getElementById('total-taken-count').innerHTML = count;
}

function SetFineAmountCollected()
{
    let returnLog = ld.GetBookReturnRecord();
    let amount = 0;
    returnLog.forEach((item) => amount += parseInt(item.FineAmount));
    document.getElementById('total-fineamount-collected').innerHTML = "₹  "+amount;
}
function SetBookLateData()
{
    let bookTakenLog = ld.GetBookLogDatabase();
    let count = 0;
    let outstandingFineAmount = 0;
    bookTakenLog.forEach ( (item) => { item.forEach((i) =>  
    {
        let dateDiff = util.GetDiff(new Date(i.PickDate), new Date());
        if (dateDiff > 10) {
            count++;
            outstandingFineAmount += (util.FINE_AMOUNT * (dateDiff - 10));
        }
    })  });
    document.getElementById('total-books-late-count').innerHTML = count;
    document.getElementById('outstanding-fine').innerHTML = `₹  ${outstandingFineAmount}`;
}

//================================================================================================================================
//=========[ Add new book ]=======================================================================================================
//================================================================================================================================
//#region Add New Book
// ========[ Choose image ]======================
function ChooseNewImage()
{
    let input = document.getElementById('choose-img-btn');
    let image = document.getElementById('choosen-image');
    if(input.files)
    {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = (e) => 
        {
            image.src = e.target.result;
        }
    }
}

// =====[ Genre list ]===========================
// ==============================================
function AddNewGenre()
{
    try
    {
        let newGenre = document.getElementById('genre-combo').value;
        document.getElementById('genre-combo').value = '';
        thisBook.AddGenre(newGenre);
        UpdateGenreListUI(thisBook.Genre);
    }
    catch (exception) {
        ShowErrorAlert(exception);
    }
}
function RemoveGenreItem(event)
{
    // let selectedElement = event.parentNode.parentNode;
    let genreList =  document.getElementById('genre-list');
    let nodes = Array.from(genreList.childNodes);
    let selectedIndex = nodes.indexOf(event);
    thisBook.RemoveGenre(selectedIndex);
    UpdateGenreListUI(thisBook.Genre);
}
function UpdateGenreListUI(givenGenreList)
{
    let genreList = document.getElementById('genre-list');
    if(genreList)
    {
        genreList.innerHTML = `${givenGenreList.map((gen) => 
            `<li id='genre-item'>
                <div>${gen}</div>
                <div id="genre-item-btn" width="10" height="10">
                    <img src="./Styles/Img/close.png" width="10" height="10">
                </div>
            </li>`).join('')}`;
    }
    let childItems = Array.from(genreList.childNodes);
    childItems.forEach(element => {
        element.addEventListener('click', function()
        {
            RemoveGenreItem(element);
        });
    });
}

// =====[ Authour list ]=========================
// ==============================================
function AddNewAuthour()
{
    try
    {
        let newAuthour = document.getElementById('authour-tb').value;
        document.getElementById('authour-tb').value = '';
        thisBook.AddAuthours(newAuthour);
        UpdateAuthorListUI(thisBook.Authuors);
    }
    catch (exception) {
        ShowErrorAlert(exception);
    }
}
function RemoveAuthourItem(event)
{
    try 
    {
        let authourList = document.getElementById('authour-list');
        let nodes = Array.from(authourList.childNodes);
        let selectedIndex = nodes.indexOf(event);
        thisBook.RemoveAuthorItem(selectedIndex);
        UpdateAuthorListUI(thisBook.Authuors);
    }
    catch (exception) {
        ShowErrorAlert(exception);
    }
}
function UpdateAuthorListUI(givenAuthourList)
{
    let authourList = document.getElementById('authour-list');
    if(authourList)
    {
        authourList.innerHTML = `${givenAuthourList.map((author) => 
            `<li id='authour-item'>
                <label>${author}</label>
                <div id="delete-item">
                    <img src="./Styles/Img/close.png" width="10" height="10">
                </div>
            </li>`).join('')}`;
    }
    let childItems = Array.from(authourList.childNodes);
    childItems.forEach(element => {
        element.addEventListener('click', function()
        {
            RemoveAuthourItem(element);
        });
    });
    
}

// ========[ Submit new book ]=====================
function SubmitNewBook()
{
    try
    {
        GrabFormValues();
        PushToMaster(thisBook);

        ShowPositiveAlert(`${thisBook.BookTitle} has been added successfully.`)
        ResetAllFields();
    }
    catch(exception)
    {
        ShowErrorAlert(exception);
    }
}
function GrabFormValues()
{
    thisBook.SetBookTitle(document.getElementById('book-title-tb').value)
    thisBook.SetISBN(document.getElementById('book-isbn-tb').value);
    thisBook.SetEdition(document.getElementById('book-edition-tb').value);
    thisBook.SetLanguage(document.getElementById('language-combo').value);
    //
    if(thisBook.Genre.length == 0)
        throw "You have to select atleast 1 genre.";
    if(thisBook.Authuors.length == 0)
        throw "Book must have author";
    //
    thisBook.SetPublisher(document.getElementById('book-publisher-tb').value);
    thisBook.SetPublisherContact(document.getElementById('book-publisher-contact').value);
    thisBook.SetPublisedDate(document.getElementById('book-pubished-date').value);
    thisBook.SetOrigin(document.getElementById('book-origin-combo').value);
    //
    thisBook.SetSection(document.getElementById('lib-section-tb').value);
    thisBook.SetRack(document.getElementById('lib-rack-tb').value);
    thisBook.SetStockCount(document.getElementById('book-stock-tb').value);
}
function PushToMaster(Book)
{
    if (Book) 
    {
        BookDatabase.set(Book.ISBN, Book);

        // 1. When new book comes to insert, check ISBN number is already exist or not.
        ld.SetBookDatabase(BookDatabase);
    }
}
//#endregion



//================================================================================================================================
//=========[ Show books ]=========================================================================================================
//================================================================================================================================
//#region [ Show Books ]

// =======[ Genre Filter section ]=================
function AddGenre() // ok
{
    let newGenre = document.getElementById('genre-filter-combo').value;
    document.getElementById('genre-filter-combo').value = '';

    if(!SelectedGenreList.includes(newGenre))
    {
        SelectedGenreList.push(newGenre);
        UpdateSelectedGenreList(SelectedGenreList);
    }
    else
        throw `${newGenre} is already has been selected.!`;    
}
function UpdateSelectedGenreList(selectedGenres) // ok
{
    let sGenreList = document.getElementById('genre-filter-selected-list');
    sGenreList.innerHTML = `${selectedGenres.map((genre) => 
        `<li>
            <label>${genre}</label>
            <div id="delete-item">
                <img src="./Styles/Img/close.png" width="10" height="10">
            </div>
        </li>`).join('')}`; 

    let childItem = Array.from(sGenreList.childNodes);
    childItem.forEach(element => 
        {
            element.addEventListener('click', function()
            {
                RemoveGenre(element);
            });
        });
}
function RemoveGenre(element) // ok
{
    let genreList = document.getElementById('genre-filter-selected-list');
    let nodes = Array.from(genreList.childNodes);
    let index = nodes.indexOf(element);
    SelectedGenreList.splice(index, 1);
    UpdateSelectedGenreList(SelectedGenreList);
    FindFilter();
}

// =======[ Authour Filter section ]=================
function FindAuthour()
{
    let inputText = document.getElementById('authour-input-key');
    if(inputText.value)
    {
        document.getElementById('search-item-list').style.display = 'block';
        let upperCase = inputText.value.toUpperCase();
        let result = AuthourMaster.filter((item) => item.toUpperCase().includes(upperCase));
        UpdateSearchDownList(result);
    }
    else
        document.getElementById('search-item-list').style.display = 'none';
}
function UpdateSearchDownList(resultList)
{
    let searchDownlist = document.getElementById('search-item-list');
    searchDownlist.innerHTML = `${resultList.map((authour) => 
        `<li id="search-list-item">${authour}</li>`).join('')}`;

    let childItem = Array.from(searchDownlist.childNodes);
    childItem.forEach(element => {
        element.addEventListener('click', function () {
            AddAuthour(element.innerHTML);
        });
    });
}
function AddAuthour(selectedItem)
{
    if(!SelectedAuthours.includes(selectedItem))
    {
        SelectedAuthours.push(selectedItem);
        UpdateSelectionAuthourListUI(SelectedAuthours);
        FindFilter();
    }   
    else
        throw `${selectedItem} is already added.`;
}
function UpdateSelectionAuthourListUI(SelectedAuthours)
{
    let selectedList = document.getElementById('authour-selected-list');
    selectedList.innerHTML = `${SelectedAuthours.map((authour) => 
        `<li>
            <label>${authour}</label>
            <div id="delete-item">
                <img src="./Styles/Img/close.png" width="10" height="10">
            </div>
        </li>`).join('')}`;
    
    let childItem = Array.from(selectedList.childNodes);
    childItem.forEach(element => 
        {
            element.addEventListener('click', function()
            {
                RemoveAuthour(element);
            });
        });

    document.getElementById('search-item-list').style.display = 'none';
    document.getElementById('authour-input-key').value = '';
}
function RemoveAuthour(element)
{
    let selectedAuthourList = document.getElementById('authour-selected-list');
    let nodes = Array.from(selectedAuthourList.childNodes);
    let index = nodes.indexOf(element);
    SelectedAuthours.splice(index, 1);
    UpdateSelectionAuthourListUI(SelectedAuthours);
    FindFilter();
}



// =====[ Filter find click ]=====================
// ===============================================
function FindFilter()
{
    let copy = Array.from(BookDatabase.values());
    if(SelectedAuthours.length > 0)
    {
        let aFound = [];
        SelectedAuthours.forEach((authour) => 
        {
            copy.filter((book) =>
            {
                if(book.Authuors.includes(authour))
                {
                    aFound.push(book);
                }
            });
        });
        copy = aFound;
    }
    if(SelectedGenreList.length > 0)
    {
        let gFound = [];
        SelectedGenreList.forEach((genre) => 
        {
            copy.filter((book) =>
            {
                if(book.Genre.includes(genre))
                {
                    gFound.push(book);
                }
            });
        });
        copy = gFound;
    }
    let mainList = document.getElementById('books-list');
    mainList.innerHTML = AdminBookCardTemplate(copy);

    Refresh_BookList_UI(copy);
}

//=============[ Show book list ]===================
function Refresh_BookList_UI(BookDatabase)
{
    try 
    {
        // BookDatabase = ld.LoadBookDatabase();
        let Bookslist = Array.from(BookDatabase.values());
        document.getElementById('books-list').innerHTML = AdminBookCardTemplate(Bookslist);

        // Addeventlistener('click') for all list item
        Invoke_EventListener_BookList(Bookslist);
    }
    catch (exception) {
        ShowErrorAlert(exception);
    }
}
function AdminBookCardTemplate(givenList)
{
    return `${givenList.map((item) => 
        `<li>
        <div class="book-card">
            <div class="cover"></div>
            <div class="book-detail">
                <div class="top-block">
                    <div class="title-block">
                        <div class="left-start">
                            <div>
                                <h3 id="b-title">${item.BookTitle}</h3>
                            </div>
                            
                            <div class="edition-badge">
                                <div class="edition">Edition</div>
                                <div class="edition-v">${item.Edition}</div>
                            </div>
                        </div>
                        <div class="right-end">
                            <div id="lang-text">
                            ${item.Language}</div>
                        </div>
                    </div>
                </div>
                <div class="center-block">
                    <div class="ISBN-block"> 
                        <div>ISBN :</div> 
                        <div>${item.ISBN}</div> 
                    </div>
                    <div class="author-block"> 
                        Authour :
                        <ul class="author-list">
                                ${item.Authuors.map((a) => `<li>${a}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="genre-block-card">
                    Genre:
                    <ul class="genre-list-card"> 
                            ${item.Genre.map((g) => `<li>${g}</li>`).join('')}
                    </ul>
                </div>
                <div class="library-detail-block">
                    <label>Library Details:</label>
                    <br>
                    <div class="library-details">
                        <div class="section-block">
                            <label>Section :</label>
                            <div id="lib-section">${item.Section}</div>
                        </div>
                        <div class="rack-block">
                            <label>Rack :</label>
                            <div id="lib-rack">${item.Rack}</div>
                        </div>
                        ${GetStockTemplate(item.StockCount)}
                    </div>
                </div>
            </div>
        </div>
    </li>`).join('')}`;
}

function GetStockTemplate(count)
{
    if(count > 0)
        return `
        <div class="stock-block" id="stock-available-block">
            <label>Stock :</label>
            <div id="lib-stock">${count}</div>
        </div>
        `
    else
        return `
        <div class="stock-block" id="stock-unavailbale-block">
            <label>Stock :</label>
            <div id="lib-stock">${count}</div>
        </div>
        `
}

function Invoke_EventListener_BookList(bookListDB)
{
    let booksList = document.getElementById('books-list');
    let bookListChildrens = Array.from(booksList.childNodes);
    bookListChildrens.forEach(item => {
        item.addEventListener('click', function () 
        {
            SelectedBookItem = bookListDB[bookListChildrens.indexOf(item)];
            InvokeSelectionCard(SelectedBookItem);
        });
    });
}

//#endregion


//================================================================================================================================
//=========[ Show user logs ]=====================================================================================================
//================================================================================================================================
//#region [Show User logs]
function Refresh_UserList_UI()
{
    try 
    {
        UserLogList = ld.GetUserLogDB();
        
        let CurrentDayUsers = UserLogList.filter((item) => {
            let logDate = new Date(item.LogTime);
            if(logDate.getDate() === new Date().getDate())
                return item;
        });

        let PreviousDayUsers = UserLogList.filter((item) => {
            let logDate = new Date(item.LogTime);
            if(logDate.getDate() < new Date().getDate())
                return item;
        });

        document.getElementById('current-day-heading').innerHTML = `Today\t: ${new Date().toDateString()}`;
        document.getElementById('users-list-today').innerHTML = GetUserList_LI_CuurentDay(CurrentDayUsers);
        document.getElementById('users-list').innerHTML = GetUserList_LI_PreviousDay(PreviousDayUsers);
    }
    catch (exception) {
        ShowErrorAlert(exception);
    }
}
function GetUserList_LI_CuurentDay(UserList)
{
    return `${UserList.map((item) =>
        `<li>
            <div class="user-item-block">
                <div id="logger-name">${item.FullName}</div> 
                <div id="logger-gender">${item.Gender}</div>
                <div id="logged-time">${new Date(item.LogTime).toLocaleTimeString()}</div>
            </div>
        </li>
        `).join('')}`;
}

function GetUserList_LI_PreviousDay(UserList)
{
    return `${UserList.map((item) =>
        `<li>
            <div class="user-item-block">
                <div id="logger-name">${item.FullName}</div> 
                <div id="logger-gender">${item.Gender}</div>
                <div id="logged-time">${new Date(item.LogTime).toDateString()}</div>
            </div>
        </li>
        `).join('')}`;
}

//======[ Selection Actions ]=====================
function InvokeSelectionCard(selectedBookItem)
{
    document.getElementById('selection-action-block').style.display = 'flex';
    document.getElementById('selected-book-title').innerText = selectedBookItem.BookTitle;
    document.getElementById('book-version').innerText = "Edition"+ selectedBookItem.Edition;
}
function DeleteSelectedItem(selectedItem)
{
    let BookLogMaster = ld.GetBookLogDatabase();
    let logMaster = Array.from(BookLogMaster.values());
    
    //Check user has taken this book before delete.
    let count = 0;
    for(let i = 0; i < logMaster.length; i++)
    {
        let logItem = Array.from(logMaster[i]);
        for (let j = 0; j < logItem.length; j++) {
            let singleItem = logItem[j];
            if (singleItem.BookId == selectedItem.ISBN) {
                count++;
            }
        }
    }
    if(count <= 0)
    {
        ld.DeleteBook(selectedItem);
        BookDatabase = ld.LoadBookDatabase();
        Refresh_BookList_UI(BookDatabase);
        ShowPositiveAlert(`${selectedItem.BookTitle} has been deleted successfully.`)
    }
    else {
        ShowErrorAlert('Book has been taken by user. Cannot delete now.!')
    }

    document.getElementById('selection-action-block').style.display = 'none';
}
//#endregion



// ========[ Logout ]==========================================
function Logout()
{
    try
    {
        cookie.DeleteCookie('cuser');
        window.location.href = "./index.html";
    }
    catch (exception) {
        console.log(exception);
    }
}
// ========[ Reset all field ]==================================
function ResetAllFields()
{
    document.getElementById('book-title-tb').value = '';
    document.getElementById('book-isbn-tb').value = '';
    document.getElementById('book-edition-tb').value = '';
    document.getElementById('language-combo').value = '';
    document.getElementById('genre-combo').value = '';
    document.getElementById('authour-tb').value = '';
    document.getElementById('book-publisher-tb').value = '';
    document.getElementById('book-publisher-contact').value = '';
    document.getElementById('book-pubished-date').value = '';
    document.getElementById('book-origin-combo').value = '';
    document.getElementById('lib-section-tb').value = '';
    document.getElementById('lib-rack-tb').value = '';
    document.getElementById('book-stock-tb').value = '';
    document.getElementById('genre-list').innerHTML = '';
    document.getElementById('authour-list').innerHTML = '';
    thisBook = new Book();
}
function InvokUpdateBook(selectedBookItem)
{
    MenuNavigate(1);
    document.getElementById('book-title-tb').value = selectedBookItem.BookTitle;
    document.getElementById('book-isbn-tb').value = selectedBookItem.ISBN;
    document.getElementById('book-edition-tb').value = selectedBookItem.Edition;
    document.getElementById('language-combo').value = selectedBookItem.Language;

    UpdateGenreListUI(selectedBookItem.Genre);
    UpdateAuthorListUI(selectedBookItem.Authuors);
    // document.getElementById('genre-combo').value = '';
    // document.getElementById('authour-tb').value = '';

    document.getElementById('book-publisher-tb').value = selectedBookItem.Publisher;
    document.getElementById('book-publisher-contact').value = selectedBookItem.PublisherContact;
    document.getElementById('book-pubished-date').value = selectedBookItem.DateOfPublished;
    document.getElementById('book-origin-combo').value = selectedBookItem.Origin;
    document.getElementById('lib-section-tb').value = selectedBookItem.Section;
    document.getElementById('lib-rack-tb').value = selectedBookItem.Rack;
    document.getElementById('book-stock-tb').value = selectedBookItem.StockCount;

    thisBook.BookTitle = selectedBookItem.BookTitle;
    thisBook.ISBN = selectedBookItem.ISBN;
    thisBook.Edition = selectedBookItem.Edition;
    thisBook.Language = selectedBookItem.Language;
    thisBook.Genre = selectedBookItem.Genre;
    thisBook.Authuors = selectedBookItem.Authuors;

    thisBook.Publisher = selectedBookItem.Publisher;
    thisBook.PublisherContact = selectedBookItem.PublisherContact;
    thisBook.DateOfPublished = selectedBookItem.DateOfPublished;
    thisBook.Origin = selectedBookItem.Origin;

    thisBook.Section = selectedBookItem.Section;
    thisBook.Rack = selectedBookItem.Rack;
    thisBook.StockCount = selectedBookItem.StockCount;
    
    document.getElementById('selection-action-block').style.display = 'none';

    Show_UpdateBook_UI();
}


function UpdateBookDetails()
{
    try {
        GrabFormValues();
        PushToMaster(thisBook);
        ShowPositiveAlert("Updated book details done!");
        Show_NewBook_UI();
        MenuNavigate(2);
    }
    catch (exception) {
        ShowErrorAlert(exception);
    }
}

// ========[ Show alert ]=================================
function ShowPositiveAlert(positiveMessage)
{
    try
    {
        document.getElementById('error-msg').style.display = 'block';
        document.getElementById('error-msg').style.backgroundColor = '#38b54b'; // Positive GREEN
        document.getElementById('error-msg-tag').innerText = positiveMessage;
        setTimeout(() => {
            document.getElementById('error-msg').style.display = 'none';    
        }, 5000);
    }
    catch(exception)
    {
        ShowErrorAlert(exception);
    }
}
function ShowErrorAlert(error)
{
    document.getElementById('error-msg').style.display = 'block';
    document.getElementById('error-msg').style.backgroundColor = '#ff3f3f'; // Negative RED
    document.getElementById('error-msg-tag').innerText = error;
    setTimeout(() => {
        document.getElementById('error-msg').style.display = 'none';    
    }, 5000);
}
// ========[ Cookie info ]======================================
function GetUserFromCookie()
{
    try
    {
        if (cookie.CheckCookie()) {
            if (UserDatabase.has(cookie.GetCookie('cuser'))) {
                return UserDatabase.get(cookie.GetCookie('cuser'));
            }
        }
        else
            return false;
    }
    catch { return false; }
}

function GetDistinctAuthoursList(booksList)
{
    let authourList = booksList.map((item) => item.Authuors);
    let distinctAuthour = [];
    authourList.forEach(element => {
        element.forEach(item => 
            {
                if(!distinctAuthour.includes(item)) 
                    distinctAuthour.push(item)
            })
    });
    return distinctAuthour;
}

function Show_UpdateBook_UI()
{
    document.getElementById('update-btn').style.display = 'block';
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('new-book-header').innerHTML = 'Update Book';
}
function Show_NewBook_UI()
{
    document.getElementById('update-btn').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'block';
    document.getElementById('new-book-header').innerHTML = 'New Book';
}
