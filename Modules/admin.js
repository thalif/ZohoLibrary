import Book from "./Model/Book.js";
import localDB from "./Utils/localDB.js";
import UserDB from "./Utils/userDB.js";
import Cookie from "./Utils/localCookie.js";

let ContextUser;
let ld = new localDB();
let cookie = new Cookie();
let genreDB;
let countryDB;
let languageDB;
let BookDatabase = new Map();
let UserDatabase = new UserDB();
let UserLogList = [];
let thisBook = new Book();
let SelectedBookItem;
window.onload = (event) =>
{
    try
    {
        genreDB = ld.Load_Genres();
        if (genreDB)
            Load_Genres(genreDB);
        //
        countryDB = ld.Load_Country();
        if (countryDB)
            Load_Countries(countryDB);

        //
        languageDB = ld.Load_Language();
        if (languageDB)
            Load_Language(languageDB);

        LoadBookDatabase();

        ContextUser = GetUserFromCookie();
        document.getElementById('user-name').innerHTML = ContextUser.FullName;
        MenuNavigate(2);
    }
    catch(exception)
    {
        
    }
}
function LoadBookDatabase()
{
    try
    {
        const fromJSON = JSON.parse(localStorage.getItem('bookDB'))
        BookDatabase = new Map(Object.entries(fromJSON));
    }
    catch(exp) { }
}

// ========[ Event listener ]=============================
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
document.getElementById('choose-img-btn').addEventListener('change', function()
{
    ChooseNewImage();
});
document.getElementById('genre-combo').addEventListener('change', function()
{
    AddNewGenre();
});
document.getElementById('menu-add-newbook').addEventListener('click', function()
{
    MenuNavigate(1);
});
document.getElementById('menu-show-allbook').addEventListener('click', function()
{
    MenuNavigate(2);
});
document.getElementById('menu-show-allusers').addEventListener('click', function()
{
    MenuNavigate(3);
});

// ===========[ Selection block buttons - add event listener ]=====================
document.getElementById('close-selection-btn').addEventListener('click', function()
{
    document.getElementById('selection-action-block').style.display = 'none';
});

document.getElementById('update-book-btn').addEventListener('click', function()
{
    alert('update book clicked. No yet implimented');
});
document.getElementById('delete-book-btn').addEventListener('click', function()
{
    DeleteSelectedItem(SelectedBookItem);
});

function MenuNavigate(s)
{
    switch(s)
    {
        case 1:
            document.getElementById('bookform-block').style.display = 'block';
            document.getElementById('show-book-block').style.display = 'none';
            document.getElementById('show-user-block').style.display = 'none';
            break;
        case 2:
            document.getElementById('bookform-block').style.display = 'none';
            document.getElementById('show-book-block').style.display = 'block';
            document.getElementById('show-user-block').style.display = 'none';
            Refresh_BookList_UI();
            break;
        case 3:
            document.getElementById('bookform-block').style.display = 'none';
            document.getElementById('show-book-block').style.display = 'none';
            document.getElementById('show-user-block').style.display = 'block';
            Refresh_UserList_UI();
            break;
        default:
            break;
    }
}
// ========[ Logout ]===================================
function Logout()
{
    try
    {
        cookie.DeleteCookie('cuser');
        window.location.href = "./index.html";
    }
    catch(exception)
    {
        console.log(exception);
    }
}

// ========[ Submit new book ]==========================
function SubmitNewBook()
{
    try
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
        
        PushToMaster(thisBook);
        ResetAllFields();
    }
    catch(exception)
    {
        ShowErrorAlert(exception);
    }
}
function PushToMaster(Book)
{
    BookDatabase.set(Book.ISBN, Book);
    localStorage.removeItem('bookDB');
    // 1. When new book comes to insert, check ISBN number is already exist or not.
    
    ld.SetBookDatabase(BookDatabase);
    // var obj = Object.fromEntries(BookDatabase);
    // var jsonString = JSON.stringify(obj);
    // localStorage.setItem('bookDB', jsonString);
}
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
    thisBook.Genre = [];
    thisBook.Authuors = [];
}

// ========[ Choose image ]=============================
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
//
function ShowErrorAlert(error)
{
    try
    {
        document.getElementById('error-msg').style.display = 'flex';
        document.getElementById('error-msg-tag').innerText = error;
        setTimeout(() => {
            document.getElementById('error-msg').style.display = 'none';    
        }, 3000);
    }
    catch(exception)
    {
        ShowErrorAlert(exception);
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
        UpdateGenreListUI();

    }
    catch(exception)
    {
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
    UpdateGenreListUI();
}
function UpdateGenreListUI()
{
    let genreList = document.getElementById('genre-list');
    if(genreList)
    {
        genreList.innerHTML = `${thisBook.Genre.map((gen) => 
            `<li id='genre-item'>
                <div>
                    <div>${gen}</div>
                    <div id="genre-item-btn" width="10" height="10">
                        <img src="./Styles/close.png" width="10" height="10">
                    </div>
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
        UpdateAuthorListUI();
    }
    catch(exception)
    {
        ShowErrorAlert(exception);
    }
}
function RemoveAuthourItem(event)
{
    let authourList = document.getElementById('authour-list');
    let nodes  = Array.from(authourList.childNodes);
    let selectedIndex = nodes.indexOf(event);
    thisBook.RemoveAuthorItem(selectedIndex);
    UpdateAuthorListUI();
}
function UpdateAuthorListUI()
{
    let authourList = document.getElementById('authour-list');
    if(authourList)
    {
        authourList.innerHTML = `${thisBook.Authuors.map((author) => 
            `<li id='authour-item'>
                <div>
                    <label>${author}</label>
                    <div id="delete-item">
                        <img src="./Styles/close.png" width="10" height="10">
                    </div>
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


// =====[ Fill initals ]=========================
// ==============================================
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


//=========[ Show books ]=======================
//==============================================

function Refresh_BookList_UI()
{
    const fromJSON = JSON.parse(localStorage.getItem('bookDB'));
    BookDatabase = new Map(Object.entries(fromJSON));
    let Bookslist = Array.from(BookDatabase.values());
    document.getElementById('books-list').innerHTML = Makelist(Bookslist);
    // Addeventlistener('click') for all list item
    Invoke_EventListener_BookList(Bookslist);
}
function Makelist(givenList)
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
                            <span>${item.Language}</span>
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
                <div class="genre-block">
                    Genre:
                    <ul class="genre-list"> 
                            ${item.Genre.map((g) => `<li>${g}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    </li>`).join('')}`;
}
function Invoke_EventListener_BookList(bookListDB)
{
    let booksList = document.getElementById('books-list');
    let bookListChildrens = Array.from(booksList.childNodes);
    bookListChildrens.forEach(item => {
        item.addEventListener('click', function () 
        {
            SelectedBookItem = bookListDB[bookListChildrens.indexOf(item)];
            console.log(SelectedBookItem);
            InvokeSelectionCard(SelectedBookItem);
        });
    });
}


//=========[ Show users ]=======================
//==============================================
function Refresh_UserList_UI()
{
    UserLogList = JSON.parse(localStorage.getItem('userLogDB'));
    document.getElementById('users-list').innerHTML = GetUserList_LI(UserLogList);
}
function GetUserList_LI(UserList)
{
    return `${UserList.map((item) =>
        `<li>
            <div class="user-item-block">
                <div>${item.FullName}</div> 
                <div>${item.Gender}</div>
                <div>${item.LogTime}</div>
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
    ld.DeleteBook(selectedItem);
    Refresh_BookList_UI();
    document.getElementById('selection-action-block').style.display = 'none';
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