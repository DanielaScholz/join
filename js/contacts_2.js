let addCard;
let editCard;

/**
 * This function returns elements found via Id.
 * 
 * @returns {elements}
 */
function getEditInputs() {
    return {
        nameInput: document.getElementById('edit-name-input'),
        emailInput: document.getElementById('edit-eMail-input'),
        phoneInput: document.getElementById('edit-phonenumber-input')
    }
}


/**
 * This function changes contact Data, If the input is valid.
 * 
 * @param {object} contact - current Contact DAta
 * @param {array} names - array filled with the Names from User input, on editContact.
 * @param {element} emailInput
 * @param {element} phoneInput
 */
function changeContactDataIfInput(contact, names, emailInput, phoneInput) {
    if (emailInput.value) {
        contact.email = emailInput.value;
    }
    if (phoneInput.value) {
        contact.phone = phoneInput.value;
    }
    if (names[0] && names[1]) {
        contact.firstName = names[0];
        contact.lastName = names[1];
    }
}


/**
 * This function sets the Contact initials at edit Contact HTMl-Element.
 * 
 */
function setEditContactInitials() {
    let contact = contacts[contactToEditId];
    const { initials1, initials2, bgColor } = getContactInfo(contact);
    document.getElementById('edit-initials-div').style = `background-color:${bgColor}`;
    document.getElementById('edit-initials-span').innerHTML = initials1 + initials2;
}


/**
 * This function fill the input values on edit Contact HTMl-Element,
 * with current Contact information.
 */
function setEditContactValues() {
    let contact = contacts[contactToEditId];
    const { nameInput, emailInput, phoneInput } = getEditInputs();
    contactName = (contact.firstName + ' ' + contact.lastName);

    nameInput.value = contactName;
    emailInput.value = contact.email;
    phoneInput.value = contact.phone;
}


/**
 * This function shows the Contact added Animation.
 */
function showUserFeedbackMessage(text) {
    popInUserFeedbackMessage(text);
    setTimeout(popOutUserFeedbackMessage, 1500);
}


/**
 * This function manipulate the contact added message classes, to show the css Animation. 
 */
function popInUserFeedbackMessage(text) {
    document.getElementById('contact-created-message').innerHTML = text;
    removeClasses('contact-created-message', 'd-none', 'slide-down');
    addClasslist('contact-created-message', 'slide-up');
}


/**
 * This function manipulate the contact added message classes, to show the css Animation. 
 */
function popOutUserFeedbackMessage() {
    removeClasslist('contact-created-message', 'slide-up');
    addClasslist('contact-created-message', 'slide-down');
    setTimeout(() => {
        addClasslist('contact-created-message', 'd-none');
    }, 500);
}


/**
 * This function removes d-none Class from Big-Card div.
 */
function showBigCard() {
    addClasslist('big-card-0', 'd-none');
    setTimeout(() => {
        removeClasslist('big-card-0', 'd-none')
        slideCard('big-card-0', 'left')
    }, 125);
}


/**
 * This function manipulate the Classes from outerDiv and rightDiv to show Mobile Big-Card.
 */
function showMobileBigCard() {
    addClasslist('contacts-outer-div', 'overflow-hidden');
    removeClasslist('contacts-right-div', 'right-div-mobile');
}


/**
 * This function manipulate the Classes from outerDiv and rightDiv to close Mobile Big-Card.
 */
function hideMobileBigCard() {
    removeClasslist('contacts-outer-div', 'overflow-hidden');
    addClasslist('contacts-right-div', 'right-div-mobile');
}


/**
 * This function iterates thru the abc Array, and search for all cardsDiv elements,
 * with given letter like `cards-div-A` till `cards-div-Z`.
 * and  clear their innerHTMl. 
 */
function clearCards() {
    for (let i = 0; i < abc.length; i++) {
        const letter = abc[i];
        const cardsDiv = document.getElementById(`cards-div-${letter}`);
        cardsDiv.innerHTML = '';
    }
}


/**
 * This function iterates thru the abc[] array, to add all Cards-main-${letter} divs the class 'd-none'.
 * 
 * @param {string} letter - This is the actual letter (one from A-Z), in the for-loop, we work with.
 * @param {element} cardsDivMain - This is the actual Element, who gets the 'd-none' class.
 */
function addDnoneCardsDivMain() {
    for (let i = 0; i < abc.length; i++) {
        const letter = abc[i];
        const cardsDivMain = document.getElementById(`cards-main-${letter}`);
        cardsDivMain.classList.add('d-none');
    }
}


/**
 * This function removes the 'd-none' class from Cards-Letter div, with a Id similar to
 * to first Letter from current renderd Contacts firstname.
 * 
 * @param {object} contact - This is the current to rendered Contact Object.
 * @param {element} cardsMainLetter - This the Element we remove the class 'd-none'.
 */
function removeDnoneCardsDivMain(contact) {
    const { cardsMainLetter } = getCardElements(contact);
    cardsMainLetter.classList.remove('d-none');
}


/**
 * This function first checks if the param actualCard is filled, call a function if true.
 * Then Highlight a Contact Card, thru the ID, given to the function.
 * Then filled the param actualCard with the ID of the Highlighted Contact.
 * 
 * @param {number} i -ID of the contact to Highlighte.
 * @param {number} actualCard -Globar var, filled with the ID of the current Higlited Contact.
 */
function addHighlightContactCard(i) {
    if (!actualCard == 0) {
        removeHighlightContactCard();
    }
    addClasslist(`contact-card-${i}`, 'contact-card-target');
    actualCard = i;
}


/**
 * This function get a Element per Id with Var inside, to get the
 * right card to remove Class 'contact-card-target'.
 */
function removeHighlightContactCard() {
    removeClasslist(`contact-card-${actualCard}`, 'contact-card-target');
    actualCard = 0;
}


/**
 * This function opens the edit-contact overlay.
 */
function openEditOverlay() {
    editCard = true;
    removeClasslist('editContactOverlay', 'd-none');
    setEditContactInitials();
    setEditContactValues();
    checkIfMobileOpening('edit-contact-shadow-screen', 'edit-contact-overlay');
    setTimeout(() => {
        window.addEventListener('click', eventListenerOverlay);
    }, 10);
}


/**
 * This function opens the add-contact overlay.
 */
function openAddOverlay() {
    addCard = true;
    removeClasslist('addContactOverlay', 'd-none');
    checkIfMobileOpening('add-contact-shadow-screen', 'add-contact-overlay');
    setTimeout(() => {
        window.addEventListener('click', eventListenerOverlay);
    }, 10);
}


/**
 * This function checks the Window size, and shows the right oerlay.
 * reltaive to Window size.
 * 
 * @param {string} shadowscreen -text with ID of Screen to show.
 * @param {string} overlay -text with ID of Screen to show.
 */
function checkIfMobileOpening(shadowscreen, overlay) {
    if (window.innerWidth > 992) {
        showShadowScreen(`${shadowscreen}`);
        slideCard(`${overlay}`, 'left');
    } else {
        showShadowScreen(`${shadowscreen}`);
    }
}


/**
 * This Function close the Edit Contact Overlay.
 */
function closeEditOverlay() {
    showDeleteBtn();
    checkWindowSizeforClosing('edit-contact-shadow-screen', 'edit-contact-overlay');
    setTimeout(() => {
        addClasslist('editContactOverlay', 'd-none');
        window.removeEventListener('click', eventListenerOverlay)
        editCard = undefined;
    }, 450);
}


/**
 * The function closes the add Contact overlay.
 */
function closeAddOverlay() {
    checkWindowSizeforClosing('add-contact-shadow-screen', 'add-contact-overlay')
    setTimeout(() => {
        addClasslist('addContactOverlay', 'd-none');
        window.removeEventListener('click', eventListenerOverlay)
        clearEditContactValues();
        addCard = undefined;
    }, 450);
}


function eventListenerOverlay(e) {
    if (window.innerWidth > 992 && editCard) {
        if (!document.getElementById('editContactOverlay').contains(e.target)) {
            closeEditOverlay();
        }
    } else if (window.innerWidth > 992 && addCard) {
        if (!document.getElementById('addContactOverlay').contains(e.target)) {
            closeAddOverlay();
        }
    }
}


/**
 * The function checks the window width to check if the user is in mobile view. It runs functions accordingly.
 * 
 * @param {string} shadowscreen - Id of the shadowscreen
 * @param {string} overlay - Id of the overlay
 */
function checkWindowSizeforClosing(shadowscreen, overlay) {
    if (window.innerWidth > 992) {
        slideCard(`${overlay}`, 'right');
        hideShadowScreen(`${shadowscreen}`)
    } else if (window.innerWidth < 992) {
        hideShadowScreen(`${shadowscreen}`);
    }
}


/**
 * This function clears the values from Edit Contact Overlay.
 */
function clearEditContactValues() {
    document.getElementById('add-name-input').value = '';
    document.getElementById('add-eMail-input').value = '';
    document.getElementById('add-phonenumber-input').value = '';
}