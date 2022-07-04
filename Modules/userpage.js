import LocalCookie from "./Utils/localCookie.js";
import UserDB from "./Utils/userDB.js";
import localDB from "./Utils/localDB.js";
import BookLog from "./Model/BookLog.js";
import LibUtil from "./Utils/util.js";


const TestDay = 4;

let SelectedGenreList = [];
let SelectedAuthours = [];

let BookDatabase = new Map();
let BookLogMaster = new Map();
let BookLogArray = [];
let AuthourMaster = [];
let GenreMaster = [];

let ContextUser;
let SelectedBookItem;

let UserBookLogList = [];
let UserBookMaster = [];
let UserReturnBook;
let UserReturnBookLog;

const libUtil = new LibUtil();
const LocalDB = new localDB();
const UserDatabase = new UserDB();
const cookie = new LocalCookie();

window.onload = (event) =>
{
    try
    {
        ContextUser = GetUserFromCookie();
        if (ContextUser) {
            Page_Constructor();
        }
        else {
            window.location.href = './index.html';
        }
    }
    catch (exception) {
        console.log(exception);
    }
}

function Page_Constructor()
{
    
    document.getElementById('user-name').innerHTML = ContextUser.FullName;
    BookDatabase = LocalDB.LoadBookDatabase();
    BookLogMaster = LocalDB.GetBookLogDatabase();
    AuthourMaster = GetDistinctAuthoursList(Array.from(BookDatabase.values()));
    LogBookLogData();
    LoadGenreMaster();
    FindFilter();
}

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
function LogBookLogData()
{
    try {
        if (BookLogMaster.size > 0) {
            UserBookLogList = Array.from(BookLogMaster.get(ContextUser.UserName));
            BookLogArray = Array.from(BookLogMaster.values());
        }
        else
            UserBookLogList = new Array();
    }
    catch (exception) {
        UserBookLogList = new Array();
    }
}
function LoadGenreMaster()
{
    GenreMaster = LocalDB.Load_Genres();
    if (GenreMaster)
        InitGenre(GenreMaster);
    else
        alert('no item ');
}

// ========[ Event listener ]========================
//#region Event Listener
document.getElementById('logout-btn').addEventListener('click', function()
{
    Logout();
});
document.getElementById('authour-input-key').addEventListener('keyup', function()
{
    FindAuthour();
});
document.getElementById('genre-combo').addEventListener('change', function(event)
{
    try
    {
        AddGenre();
        FindFilter();
    }
    catch(exception)
    {
        console.log(exception);
    }
});
document.getElementById('book-return-close-btn').addEventListener('click', function()
{
    document.getElementById('book-return-card').style.display = 'none';
});
//
document.getElementById('book-selection-close-btn').addEventListener('click', function()
{
    document.getElementById('book-selection-card').style.display = 'none';
});
document.getElementById('get-book-btn').addEventListener('click', function()
{
    TakeBook();
});
document.getElementById('menu-find-book').addEventListener('click', function()
{
    MenuNavigate(1);
});
document.getElementById('menu-return-book').addEventListener('click', function()
{
    MenuNavigate(2);
});

document.getElementById('pay-fine-btn').addEventListener('click', function()
{
    PayFine(UserReturnBookLog);
});
document.getElementById('return-book-btn').addEventListener('click', function()
{
    BookReturn();
    document.getElementById('book-return-card').style.display = 'none';
});
document.getElementById('menu-setting-btn').addEventListener('click', function()
{
    InvokeSettingCard();
});
document.getElementById('setting-card-close-btn').addEventListener('click', function()
{
    document.getElementById('setting-card').style.display = 'none';
});
document.getElementById('delete-account-btn').addEventListener('click', function()
{
    try
    {
        let result = UserDatabase.DeleteUser(ContextUser);
        if (result === '') {
            window.location.href = "./index.html";
        }
        else {
            alert(result);
        }
        document.getElementById('setting-card').style.display = 'none';
    }
    catch (ex) {
        alert(ex);
    }
});

//#endregion


function MenuNavigate(index)
{
    switch(index)
    {
        case 1:
            document.getElementById('center-filter-block').style.display = 'flex';
            document.getElementById('search-content-list').style.display = 'flex';
            document.getElementById('user-bookpick-list').style.display = 'none';
            FindFilter();
            break;

        case 2:
            document.getElementById('center-filter-block').style.display = 'none';
            document.getElementById('search-content-list').style.display = 'none';
            document.getElementById('user-bookpick-list').style.display = 'flex';
            
            InvokeReturnPage();
            break;
        default:
            break;
    }
}
// =====[ Genre filter action ]======================
function AddGenre()
{
    let newGenre = document.getElementById('genre-combo').value;
    if(!SelectedGenreList.includes(newGenre))
    {
        SelectedGenreList.push(newGenre);
        UpdateSelectedGenreList(SelectedGenreList);
    }
    else
        throw `${newGenre} is already has been selected.!`;
    //
    document.getElementById('genre-combo').value = '';
}
function RemoveGenre(element)
{
    let genreList = document.getElementById('genre-selected-list');
    let nodes = Array.from(genreList.childNodes);
    let index = nodes.indexOf(element);
    SelectedGenreList.splice(index, 1);
    UpdateSelectedGenreList(SelectedGenreList);
    FindFilter();
}
function UpdateSelectedGenreList(selectedGenres)
{
    let sGenreList = document.getElementById('genre-selected-list');
    sGenreList.innerHTML = `${selectedGenres.map((genre) => 
        `<li>
            <label>${genre}</label>
            <div id="delete-item">
                <img src="./Styles/close.png" width="10" height="10">
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
function FindBookForGenre(genre, database)
{
    let result = [];
    let bookMaster = Array.from(database);
    bookMaster.forEach((book) => 
    {
        if(book.Genre.includes(genre))
            result.push(book);
    });
    return result;
}

// =====[ Authour filter action ]=====================
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
                <img src="./Styles/close.png" width="10" height="10">
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
function FindBookForAuthour(authour, database)
{
    let result = [];
    let bookMaster = Array.from(database);
    bookMaster.forEach((book) => 
    {
        if(book.Authuors.includes(authour))
            result.push(book);
    });
    return result;
}


// =====[ List item templates ]===================
// ===============================================
function BookShowTemplate(givenList)
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
                <div class="genre-block">
                    Genre:
                    <ul class="genre-list"> 
                            ${item.Genre.map((g) => `<li>${g}</li>`).join('')}
                    </ul>
                </div>

                ${AvailCheck(item.ISBN)}
                
            </div>
        </div>
    </li>`).join('')}`;
}
function UserBookReturnListTemplate(givenList)
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
                <div class="genre-block">
                    Genre:
                    <ul class="genre-list"> 
                            ${item.Genre.map((g) => `<li>${g}</li>`).join('')}
                    </ul>
                </div>

                ${ReturnCheck(item.ISBN)}
                
            </div>
        </div>
    </li>`).join('')}`;
}
function AvailCheck(isbn)
{
    let book = BookDatabase.get(isbn);
    
    if(book.StockCount > 0)
        return`
        <div class="in-stock-block">
            <div id="in-stock-text">In Stock</div>
        </div>`;
    else
    {
        // Get least book return date.
        let leastDate = new Date();
        BookLogArray = Array.from(BookLogMaster.values());
        for(let i = 0; i < BookLogArray.length; i++)
        {
            let bookLog = Array.from(BookLogArray[i]);
            for (let j = 0; j < bookLog.length; j++) {
                if (bookLog[j].UserName = ContextUser.UserName && bookLog[j].BookId == isbn) 
                {
                    let pd = new Date(bookLog[j].PickDate);
                    if (leastDate > pd)
                        leastDate = pd;
                }
            }
        }
        //===================
        let leastDay = libUtil.GetDiff(leastDate, new Date());
        if(leastDay == 0)
        {
            return `
            <div class="not-avail-stock-block">
                <div id="not-avail-text">Stock unavailable</div>
            </div>`;
        }
        if (leastDay > 10)
            return `
            <div class="not-avail-block">
                <div id="not-avail-text">Available in soon!</div>
            </div>`;
        else
            return `
            <div class="avail-in-block">
                <div id="avail-in-text">Avail in ${ 10 - leastDay} day's!</div>
            </div>`;
    }
}
function ReturnCheck(isbn)
{
    for(let i = 0; i < UserBookLogList.length; i++)
    {
        let userLog = UserBookLogList[i];
        if(userLog.BookId == isbn)
        {
            let pickedDate = new Date(userLog.PickDate);
            let days = libUtil.GetDiff(pickedDate, new Date());
            if((10 - days) > 0)
            {
                return `
                    <div class="return-in-block">
                        <div id="avail-in-text">Return in ${10 -days} day's!</div>
                    </div>`;
            }
            else
            {
                let fineAmount = libUtil.GetFineAmount(userLog.PickDate, new Date());
                return `
                    <div class="return-imediate-block">
                        <div id="avail-in-text">Return imediate with fine amount ${fineAmount}!</div>
                    </div>`;
            }
        }
    }
}


// =====[ Filter find click ]=====================
// ===============================================
function FindFilter()
{
    let copy = Array.from(BookDatabase.values());
    if(SelectedAuthours.length > 0)
    {
        let aFound = [];
        SelectedAuthours.forEach((item) => 
        {
            let booksfound = FindBookForAuthour(item, copy);
            booksfound.forEach((book) => { aFound.push(book) });
        });
        copy = aFound;
    }
    if(SelectedGenreList.length > 0)
    {
        let gFound = [];
        SelectedGenreList.forEach((item) => 
        {
            let booksfound = FindBookForGenre(item, copy);
            booksfound.forEach((book) =>  { gFound.push(book)});
        });
        copy = gFound;
    }
    let mainList = document.getElementById('search-content-list');
    mainList.innerHTML = BookShowTemplate(copy);

    let childItem = Array.from(mainList.childNodes);
    childItem.forEach(element => 
        {
            element.addEventListener('click', function()
            {
                SelectedBookItem = copy[childItem.indexOf(element)];
                InvokeBookSelectionCard(SelectedBookItem);
            });
        });
}


// =======[ Book Take ]===========================
// ===============================================
function TakeBook()
{
    if (ContextUser && SelectedBookItem) {
        // Check stock count.
        let tempCount = Array.from(UserBookLogList.filter((item) => item.BookId == SelectedBookItem.ISBN)).length;
        if (tempCount <= 0) {

            if (SelectedBookItem.StockCount > 0) {
                let bookPick = new BookLog();
                bookPick.UserName = ContextUser.UserName;
                bookPick.BookId = SelectedBookItem.ISBN;
                bookPick.PickDate = new Date();
                bookPick.PickDate.setDate(bookPick.PickDate.getDate() - TestDay);
                
                //Check user already has this book.
                if (UserBookLogList.length > 0) {
                    //Check user already picked count is less than 4
                    if (UserBookLogList.length < 4) {
                        // Update stock count
                        SelectedBookItem.StockCount--;
                        UserBookLogList.push(bookPick);
                        BookLogMaster.set(ContextUser.UserName, UserBookLogList);

                        LocalDB.SetBookLogDatabase(BookLogMaster);
                        LocalDB.SetBookDatabase(BookDatabase);
                    }
                    else {
                        alert(`Already user has ${UserBookLogList.length} books.`);
                    }
                }
                else {
                    // Update stock count
                    SelectedBookItem.StockCount--;
                    UserBookLogList.push(bookPick);
                    BookLogMaster.set(ContextUser.UserName, UserBookLogList);

                    LocalDB.SetBookLogDatabase(BookLogMaster);
                    LocalDB.SetBookDatabase(BookDatabase);
                }
            }
            else {
                alert('No Stock!');
            }
        }
        else {
            alert(`User already has ${SelectedBookItem.BookTitle}!`);
        }
    }
    FindFilter();
    document.getElementById('book-selection-card').style.display = 'none';
}
// =======[ Return Book ]=========================
// ===============================================
function ReturnBook(element)
{
    UserReturnBookLog = UserBookLogList[element];
    InvokeBookReturnCard(UserReturnBookLog);
}
function BookReturn()
{
    UserBookLogList = UserBookLogList.filter((book) => book.BookId != UserReturnBook.ISBN);
    // Update user account DB
    if (UserBookLogList.length > 0)
        BookLogMaster.set(ContextUser.UserName, UserBookLogList);
    else
        BookLogMaster.delete(ContextUser.UserName);

    LocalDB.SetBookLogDatabase(BookLogMaster);
    InvokeReturnPage();
    
    // Update Book Stock count
    let ddd = BookDatabase.get(UserReturnBook.ISBN);
    ddd.StockCount++;
    LocalDB.SetBookDatabase(BookDatabase);
}


// =======[ Book Return ]=========
function InvokeReturnPage()
{
    UserBookMaster = [];
    UserBookLogList.forEach((book) => 
    {
        let bb = BookDatabase.get(book.BookId);
        UserBookMaster.push(bb);
    });
    UpdateUserReturnListUI(UserBookMaster);
}
function UpdateUserReturnListUI(givenList)
{
    let bookPickList = document.getElementById('user-bookpick-list');
    bookPickList.innerHTML = '';
    bookPickList.innerHTML = UserBookReturnListTemplate(givenList);

    let childItem = Array.from(bookPickList.childNodes);
    childItem.forEach(element => 
        {
            element.addEventListener('click', function()
            {
                ReturnBook(childItem.indexOf(element));
            });
        });
}


// =======[ Invoke book selection card ]================
function InvokeBookSelectionCard()
{
    document.getElementById('book-selection-card').style.display = 'block';
    document.getElementById('selected-book-title').innerText = SelectedBookItem.BookTitle;
    document.getElementById('book-version').innerText = 'Edition'+ SelectedBookItem.Edition;
    document.getElementById('isbn-number').innerText = SelectedBookItem.ISBN;
}
// =======[ Invoke book return card ]===================
function InvokeBookReturnCard(booklog)
{
    UserReturnBook = BookDatabase.get(booklog.BookId);
    let fineAmount = libUtil.GetFineAmount(booklog.PickDate, new Date());

    document.getElementById('book-return-card').style.display = 'flex';
    document.getElementById('return-book-title').innerText = UserReturnBook.BookTitle;
    document.getElementById('isbn-number').innerText = UserReturnBook.ISBN;
    document.getElementById('return-book-version').innerText = UserReturnBook.Edition;

    if(fineAmount > 0)
    {
        document.getElementById('pay-fine-btn').style.display = 'flex';
        document.getElementById('return-book-btn').style.display = 'none';
        document.getElementById('pay-fine-btn').innerText = 'Pay fine amount '+ fineAmount;
    }
    else
    {
        document.getElementById('pay-fine-btn').style.display = 'none';
        document.getElementById('return-book-btn').style.display = 'flex';
    }
}

// ========[ Pay fine amount ]=======================
function PayFine(booklog)
{
    let fineAmount = libUtil.GetFineAmount(booklog.PickDate, new Date());

    let dddd = UserBookLogList.filter((book) => book.BookId == UserReturnBook.ISBN)[0];
    let index =  UserBookLogList.findIndex(book => book.BookId === dddd.BookId);
    
    UserReturnBook = UserBookLogList[index];
    UserReturnBook.PickDate = new Date();
    UserBookLogList[index] = UserReturnBook;

    // Update collection record
    LocalDB.UpdateFineColleciton(ContextUser, UserReturnBook, fineAmount);

    // Update user account book record DB
    BookLogMaster.set(ContextUser.UserName, UserBookLogList);
    LocalDB.SetBookLogDatabase(BookLogMaster);

    InvokeBookReturnCard(UserReturnBook);
    UpdateUserReturnListUI(UserBookMaster);
}
// =======[ Load Initials ]==========================
function InitGenre(genreList)
{
    let genreCombo = document.getElementById('genre-combo');
    genreCombo.innerHTML = `${genreList.map((genre) => `<option>${genre}</option>` ).join('')}`;
    document.getElementById('genre-combo').value = '';
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


// ========[ Setting Card ]=============================
function InvokeSettingCard()
{
    document.getElementById('setting-card').style.display = 'block';
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