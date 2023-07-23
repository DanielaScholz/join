let spliceCurrentContact;
let indexOfCurrentContact = -1;
let headerMenu;
let email;
let existingUserName;
let users = [];

let alreadyGreetMobile = false;
/**
 * The variable is set to true or false, depending if the new_task template card is open or not.
 */
let newTaskOpen;
let mobileTemplateOpen = false;
let normalTemplateOpen = false;

/*----------- GENERAL FUNCTIONS TO INITIALIZE PAGE -----------*/
/**
 * The function plays the loadBackend() and includeHTML() functions.
 */
async function load() {
    await loadBackend();
    await includeHTML();
    checkURLandHighlight();
    setFaviconColorTheme();
    if (window.location.pathname == '/index.html') {
        loadUserCredentials();
    }
}


/**
 * The function loads all Data that is currently saved at the backend database.
 */
async function loadBackend() {
    await downloadFromServer();
    todos = JSON.parse(backend.getItem('todo')) || [];
    categories = JSON.parse(backend.getItem('category')) || [];
    contacts = JSON.parse(backend.getItem('contact')) || [];
    assignments = JSON.parse(backend.getItem('assignments')) || [];
    existingUser = backend.getItem('currentUser') || [];
    users = JSON.parse(backend.getItem("users")) || [];
}


/**
 * This function deletes Item from Array and Saves manipulated Array to Backend. 
 * 
 * @param {array} array -array to splice an save.
 * @param {number} deleteId -Id of the Item to delete.
 */
function deleteItemFromBackend(array, deleteId) {
    let newArray = array.splice(deleteId, 1);
    backend.deleteItem(array);
    saveArrayToBackend(newArray);
}


/**
 * This function saves given Array with given Key to Backend.
 * 
 * @param {string} key -key to find saved Array.
 * @param {array} array -array to get saved.
 */
function saveArrayToBackend(key, array) {
    let arrayAsText = JSON.stringify(array);
    backend.setItem(key, arrayAsText);
}


/**
 * This function highlightes the active navigation point on the sidebar. At first the function checks if the current page is 'Legal notice' or 
 * if it's an other page.
 * 
 * @param {string} navPoint - id of the current (active) navigation point
 */
function checkURLandHighlight(navPoint) {
    if (document.URL.includes('legal_notice')) {
        addClasslist('legal_notice', 'nav-highlight');
    } else if (document.getElementById(`${navPoint}`)) {
        addClasslist(`${navPoint}`, 'nav-highlight');
    }
}


/*----------- GENERAL SHOW AND HIDE FUNCTIONS -----------*/
/**
 * Adds one CSS class from an element's class list.
 *  * @param {string} elm - The ID of the element to remove the classes from.
 *  * @param {string} className - One CSS class name to remove.
 */
function addClasslist(elm, className) {
    document.getElementById(`${elm}`).classList.add(`${className}`);
}


/**
 * Removes one CSS class from an element's class list.
 *  * @param {string} elm - The ID of the element to remove the classes from.
 *  * @param {string} className - One CSS class name to remove.
 */
function removeClasslist(elm, className) {
    document.getElementById(`${elm}`).classList.remove(`${className}`);
}


/**
 * Removes one or more CSS classes from an element's class list.
 *
 * @param {string} elm - The ID of the element to remove the classes from.
 * @param {...string} classes - One or more CSS class names to remove.
 */
function removeClasses(elm, ...classes) {
    let classList = document.getElementById(`${elm}`).classList;
    classes.forEach(className => classList.remove(className));
}


/**
 * Adds one or more CSS classes to an element's class list.
 *
 * @param {string} elm - The ID of the element to add the classes to.
 * @param {...string} classes - One or more CSS class names to add.
 */
function addClasses(elm, ...classes) {
    let classList = document.getElementById(`${elm}`).classList;
    classes.forEach(className => classList.add(className));
}


/**
 * The function shows the new Task Template depending on the window width. It also sets the newTaskOpen variable to true.
 */
async function showNewTaskCard() {
    newTaskOpen = true;
    if (window.innerWidth <= 992) {
        await showMobileTemplate();
        mobileTemplateOpen = true;
    } else {
        await showNormalTemplate();
        normalTemplateOpen = true;
    }
}


/**
 * The eventlistener listens for clicks on the window. If the user clicks the window but not the new task card, a new task card is open and
 * the width of the window is bigger than 992px, the task gets hidden. That means if you habe a new Task card opened and you click outside the
 * card, the card closes.
 */
window.addEventListener('click', (e) => {
    if (newTaskOpen && window.innerWidth > 992) {
        if (document.getElementById('content-new-task') && !document.getElementById('content-new-task').contains(e.target)) {
            hideNewTaskCard();
        }
    }
});


/**
 * Function to show shadowscreen, per Id.
 */
function showShadowScreen(shadowDivId) {
    removeClasses(`${shadowDivId}`, 'd-none','smooth-opacity-out');
    addClasslist(`${shadowDivId}`, 'smooth-opacity-in');
}


/**
 * Function to hide shadowscreen, per Id
 */
function hideShadowScreen(shadowDivId) {
    removeClasslist(`${shadowDivId}`, 'smooth-opacity-in');
    addClasses(`${shadowDivId}`,'d-none', 'smooth-opacity-out');
    setTimeout(() => { addClasslist(`${shadowDivId}`, 'd-none') }, 450);
}


/**
 * Animates a card sliding in or out of view.
 *
 * @param {string} idOfDiv - The ID of the element to slide.
 * @param {string} direction - The direction to slide the card. Can be either 'left' or 'right'.
 */
function slideCard(idOfDiv, direction) {
    const slideIn = direction === 'left';
    removeClasslist(`${idOfDiv}`, slideIn ? 'slide-right' : 'slide-left');
    addClasslist(`${idOfDiv}`, slideIn ? 'slide-left' : 'slide-right');
}


/**
 * function to show the close Button on NewTask template
 */
function showNewTaskCloseBtn() {
    removeClasslist('new-task-close-btn', 'd-none')
}


/**
 * function to hide the close Button on NewTask template
 */
function hideNewTaskCloseBtn() {
    let closeBtn = document.getElementById('new-task-close-btn');
    if (closeBtn) { addClasslist('new-task-close-btn', 'd-none');}
}


/**
 * In the first place this function checks the width of the window. Either the mobile-menu or the logout-button shows or hide per click of
 * the avatar-button.
 */
function toggleMobileMenu() {
    checkWindowSize();
    headerMenu.classList.toggle('show');
}


/**
 * In the first place this function checks the width of the window. Depending on the width the user sees a mobile menu oder a logout-button.
 */
function checkWindowSize() {
    return window.innerWidth <= 992 ? headerMenu = document.getElementById('mobileMenu') : headerMenu = document.getElementById('logoutBtn');
}


/**
 * This Function to manipulate the Delete Button on Contacts and Board,.html.
 */
function confirmDelete(functionName) {
    changeDeleteBtnOnclick(`${functionName}`);
    changeDeleteBtnSpan('Confirm');
}


/**
 * This Function calls functions to manipulate the Delete Button.
 */
function showDeleteBtn() {
    changeDeleteBtnOnclick('confirmDelete(`deleteContact()`)')
    changeDeleteBtnSpan('Delete');
}


/**
 * This Function changes onclick of the Delete Button.
 */
function changeDeleteBtnOnclick(functionName) {
    document.getElementById('edit-delete-btn').setAttribute('onclick', `${functionName}`);
}


/**
 * This Function changes the Text of the Delete Button.
 */
function changeDeleteBtnSpan(html) {
    document.getElementById('delete-btn-span').innerHTML = html;
}


/**
 * This function, runs if the user changes the color theme of his Browser to Dark.
 */
function setFaviconIfColorThemeChanged() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        setFaviconColorTheme();
    });
}


/**
 * This function, changes all hrefs from the favicons, to show right Favicon on Color theme Dark and Light.
 */
function setFaviconColorTheme() {
    let appleFav = document.getElementById('apple-fav');
    let bigFav = document.getElementById('32-fav');
    let smallFav = document.getElementById('16-fav');
    let manifest = document.getElementById('manifest');
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        appleFav.href = 'assets/favicon/favicon_light/apple-touch-icon.png';
        bigFav.href = 'assets/favicon/favicon_light/favicon-32x32.png';
        smallFav.href = 'assets/favicon/favicon_light/favicon-16x16.png';
        manifest.href = 'assets/favicon/favicon_light/site.webmanifest';
    } else {
        appleFav.href = 'assets/favicon/favicon_dark/apple-touch-icon.png';
        bigFav.href = 'assets/favicon/favicon_dark/favicon-32x32.png';
        smallFav.href = 'assets/favicon/favicon_dark/favicon-16x16.png';
        manifest.href = 'assets/favicon/favicon_dark/site.webmanifest';
    }
    setFaviconIfColorThemeChanged();
}


/**
 * This function stops events from Propagation.
 */
function preventPropagation() {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
}