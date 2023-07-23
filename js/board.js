/**
 * Define JSON
 * @typedef {string} JSON
 */
/**
 * The array includes all todos that match with input value of the search input-field at the top of board.html.
 */
let searchedTodos = [];
/**
 * Elements that are currently dragged.
 */
let currentDraggedElements;
/**
 * Id of the task that is currently edited.
 */
let taskToEdit;
let detailViewOpen = false;
let editTaskOpen = false;
let checkedSubtasks = 0;


/**
 * The function initiates the Board. The data from the backend is loaded and the board is rendered.
 */
async function initBoard() {
    await load();
    selectingArrayForBoardUpdate();
    checkURLandHighlight('board');
}


/**
 * The function checks if a progressbar is needed at a task card at the board. If there are subtasks, a progressbar is shown.
 * 
 * @param {JSON} element - The task which is checked
 */
function checkIfProgressBar(element) {
    let progressBar = document.getElementById(`progress-bar-${element.id}`);
    if (element.subtasks.length > 0)
        progressBar.classList.remove('d-none');
}


/**
 * The function calculates the length of the progressbar of a specific task.
 * 
 * @param {JSON} element - The task of which the progressbar gets calculated
 * @returns {number} - Progress that has been made made
 */
function calculateProgressBar(element) {
    return (100 / element.subtasks.length) * checkedSubtasks;
}


/**
 * The Eventlistener runs a function on resizing the window. If the location is currently contacts.html or board.html and the new task card is
 * open, the new task card is closed.
 */
window.addEventListener('resize', function () {
    if (location.href.includes('board.html') || location.href.includes('contacts.html')) {
        if (newTaskOpen == true) {
            hideNewTaskCard();
        }
    }
});


/**
 * This function initiate a function call.
 * @param {array} todos - array of all todos, saved in the backend
 */
function renderBoard(todos) {
    clearBoard();
    renderCardColumn(todos, 'todo');
    renderCardColumn(todos, 'progress');
    renderCardColumn(todos, 'feedback');
    renderCardColumn(todos, 'done');
}


/**
 * This function clears the board.
 */
function clearBoard() {
    document.getElementById('todo').innerHTML = '';
    document.getElementById('progress').innerHTML = '';
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('done').innerHTML = '';
}

/**
 * In the first step this functions filters the array according to the status of the todos. the filtered todos are
 * displayed in the corresponding container of the status on the board.
 * In the last place this function checks, if the task is assigned for another team member or more. 
 * 
 * The following functions do the same thing, except the status is different.
 * @param {array} todos - array of all todos, saved in the backend
 */
function renderCardColumn(todos, column) {
    let todo = todos.filter(t => t.status == column);
    for (let i = 0; i < todo.length; i++) {
        const element = todo[i];
        const id = todo[i].id;
        const assignments = todo[i].assignments;

        countCheckedSubtasks(element);
        document.getElementById(column).insertAdjacentHTML("beforeend", generateHTMLTaskCard(element));

        checkIfAssignments(assignments, element);
        checkIfProgressBar(element);

        checkedSubtasks = 0;
    }
}


/**
 * This function Counts the checked Subtasks, to render the Progress-bar.
 * 
 * @param {object} object -Class Task object.
 */
function countCheckedSubtasks(object) {
    for (let i = 0; i < object.subtasks.length; i++) {
        if (object.subtasks[i].checked) {
            checkedSubtasks++;
        }
    }
}


function checkIfAssignments(assignments, element) {
    if (assignments.length > 0) {
        renderAssignments(assignments, element);
        checkForSecondUser(assignments, element);
        checkForMoreUsers(assignments, element);
    }
}


function renderAssignments(assignments, element) {
    let firstUserIcon = assignments[0].firstName.slice(0, 1) + assignments[0].lastName.slice(0, 1);
    document.getElementById(`card-bottom-${element.id}`).innerHTML += generateHTMLTaskCardAssignments(assignments, element, firstUserIcon);
}


/**
 * This function checks, if a second user is intended for a task. If so an icon with initials is created.
 * @param {array} assignments - array of the assigned persons to a todo. This array is subdivided as follows: color, email, first name and last name.
 * @param {number} id - id of the current todo
 */
function checkForSecondUser(assignments, element) {
    if (assignments.length > 1) {
        let secondUserIcon = assignments[1].firstName.slice(0, 1) + assignments[1].lastName.slice(0, 1);
        document.getElementById(`user-icons-${element.id}`).innerHTML += `
            <div id="second-user-icon-${element.id}" class="user-icon" style="background:${assignments[1].color}; left:30px;"><span>${secondUserIcon}</span></div>`;
    }
}


/**
 * This function checks, if more users than 2 are assigned for a task. From the third assigned user, the icon contains the number of the assigned users. 
 * @param {array} assignments - array of the assigned persons to a todo. This array is subdivided as follows: color, email, first name and last name.
 * @param {number} id - id of the current todo
 */
function checkForMoreUsers(assignments, element) {
    if (assignments.length >= 3) {
        let userlength = assignments.length - 2;
        document.getElementById(`user-icons-${element.id}`).innerHTML += `
        <div id="more-than-two-users" class="user-icon" style="background:#000000; left:60px"><span>+${userlength}</span></div>`;
    }
}



/*----------- ADDS NEW TASK TO SELECTED STATUS -----------*/
/**
 * This function opens the add task overlay by pressing the add button at status progress.
 */
function addTaskToStatus(status) {
    progressStatus = `${status}`;
    showNewTaskCard();
}


/**
 * Function checks if there is a specific search value at the search input-field. If not, the board is updated from the
 * array todos, which includes ALL tasks. If a search value exists the board is updated from the array searchedTodos.
 */
function selectingArrayForBoardUpdate() {
    if (!document.getElementById('find-task').value) {
        renderBoard(todos);
    } else {
        renderBoard(searchedTodos);
    }
}


/**
 * This function calls all functions needed for, to let the User delete a Task. First it shows the Delete Button, then splices the 
 * todos Array at a specific position, given by the Global var taskToEdit.
 * Then calls function setNewTodoIds() wich giv all todos new Ids so they have still the same Ids like their position in todos Array.
 * Then saves manipulated Array to Backend. On Next step it close the Detail View of the Todo.
 * On Last it calls renderBoard() with new todos Array.
 */
function deleteTask() {
    showDeleteBtn();
    todos.splice(taskToEdit, 1);
    setNewTodoIds();
    saveArrayToBackend('todo', todos);
    closeDetailView();
    renderBoard(todos);
}


/**
 * This function iterates thru the todos Array, and give each todo a new Id, from first todo wich became the Id: 0,
 * till last todo wich then have the same Id like the todos Array length.
 */
function setNewTodoIds() {
    for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];
        todo.id = i;
    }
}


/*----------- DRAG AND DROP -----------*/
/**
 * The global defined variable 'currentDraggedElement' is undefined in the first place. When moving a task to another status-column the global 
 * variable gets the value of the id of the current task card.
 * @param {number} id id of the current task card.
 */
function startDragging(id) {
    currentDraggedElement = id;
    setTimeout(() => {
        hideCardColumnDivs(id);
        showDropableSpace();
    }, 50); // Timeout to avoid Bug
}


/**
 * The function hides all Cards that are not currently dragged.
 * 
 * @param {number} id - id of the current task card
 */
function hideCardColumnDivs(id) {
    for (let i = 0; i < todos.length; i++) {
        const divId = todos[i].id;
        if (divId !== id) {
            document.getElementById(divId).classList.add('d-none');
        }
    }
}


/**
 * This function allows to move a task to another status-column. To allow the drop, the default handling of the element must be prevented.
 * @param {*} dragEvent - when the dragged data is dropped, a drop event occurs.
 */
function allowDrop(dragEvent) {
    dragEvent.preventDefault();
}


/**
 * This functions overwirte the status when moving the task to a new status-column and saves it at the backend.
 * @param {string} status - there are 4 different status option: to do, in progress, feedback and done
 */
function moveTo(status) {
    todos[currentDraggedElement]['status'] = status;
    renderBoard(todos);
    saveStatus();
}


/**
 * The function sets the status of a given task to a given status. It also saves the status and closes the detail view window at the board.
 * 
 * @param {number} index - Index of the task at the todos array
 * @param {string} status - Status of the task
 */
function mobileMoveTo(index, status) {
    todos[index]['status'] = status;
    saveStatus();
    closeDetailView();
}


/**
 * The function saves the new status of the task at the todos array at the backend database.
 */
function saveStatus() {
    let todosAsText = JSON.stringify(todos);
    backend.setItem('todo', todosAsText);
}


/*----------- SEARCH FUNKTION FOR FINDING SPECIFIC TASK -----------*/
/**
 * Function that checks if the value of the search input-field matches with title or description values of the tasks in the todos array.
 * If a task title or description includes the search value it is pushed into the array searchedTodos before it finally gets updated to the
 * board.
 */
function findTask() {
    searchedTodos = [];
    let search = document.getElementById('find-task').value;
    let searchedLC = search.toLowerCase();
    for (let i = 0; i < todos.length; i++) {
        const title = todos[i].title;
        const description = todos[i].description;
        if (title.toLowerCase().includes(searchedLC) || description.toLowerCase().includes(search)) {
            searchedTodos.push(todos[i]);
        }
        selectingArrayForBoardUpdate();
    }
}


/*----------- DETAIL VIEW OF TASK CARD-----------*/
/**
 * This function shows the details of a task when clicking on it.  
 * @param {number} idOfCard - id of the current task card
 */
function showTaskCard(idOfCard) {
    detailViewOpen = true;
    taskToEdit = idOfCard;
    removeClasslist('detailView', 'd-none');
    showShadowScreen('detail-view-shadow-screen');
    document.getElementById('detailView').innerHTML = generateHTMLDetailCard(idOfCard);
    howMuchUsersAreAssigned(idOfCard);
    setTimeout(() => {
        window.addEventListener('click', handleClickEvent);
    }, 10);
}


/**
 * Support function for eventlistener, to listen for clicks outside the detailView or edit-view container.
*/
function eventListenerDetailOrEditView(e, isOpen){
    if (isOpen && window.innerWidth > 992) {
        if (!document.getElementById('detailView').contains(e.target)) {
            closeDetailView();
        }
    }
}


/**
 * Registers an event listener for clicking on the window to close the detail or edit view
 * if the user clicks on a different part of the window.
 * 
 * @param {MouseEvent} e - The MouseEvent object that triggered the click event.
 * @returns {void}
 */
function handleClickEvent(e) {
    if (detailViewOpen) {
      eventListenerDetailOrEditView(e, detailViewOpen);
    }
    if (editTaskOpen) {
      eventListenerDetailOrEditView(e, editTaskOpen);
    }
  }


/**
 * This function closes the detail view of the card when pressing the x-mark. The shadow-screen is removed and the board update.
 */
function closeDetailView() {
    editTaskOpen = false;
    detailViewOpen = false;
    subtasks = [];
    assignedContacts = [];
    addClasslist('detailView', 'd-none');
    hideShadowScreen('detail-view-shadow-screen');
    renderBoard(todos);
    window.removeEventListener('click', handleClickEvent);
    window.removeEventListener('click', handleClickEvent);
}


/**
 * This function checks how much persons are assigned to one task. It generates the full name, the initials and the background color 
 * of the initials-container of each person which is shown at the detail view of the task card.
 * @param {number} idOfCard - id of the current task card
 */
function howMuchUsersAreAssigned(idOfCard) {
    let assignmentsArray = todos[idOfCard].assignments;
    for (let i = 0; i < assignmentsArray.length; i++) {
        const assignment = assignmentsArray[i];
        let assignedContact = assignment.firstName + " " + assignment.lastName;
        let initials = assignment.firstName.slice(0, 1) + assignment.lastName.slice(0, 1);
        let initialsBg = assignment.color;
        document.getElementById('assignedContacts').innerHTML += /*html*/`
        <div class="assignedContacts">
            <div class="initials-icon" style="background: ${initialsBg}">
                <span>${initials}</span>
            </div>
            <div>${assignedContact}</div>
        </div>
        `;
    }
}


/*----------- DRAG AND DROP ALTERNATIVE FOR MOBILE DEVICES-----------*/
/**
 * This function shows and removes the mobile-move-menu by pushing the MOVE-Button.
 */
function openMoveMenu() {
    let mobileMoveMenu = document.getElementById('mobileMove');
    mobileMoveMenu.classList.toggle('d-none');
    if (!mobileMoveMenu.classList.contains('d-none')) {
        setTimeout(() => {
            window.addEventListener('click', eventListenerMoveBtn)
        }, 10);
    }
}


/**
 * This function closes the mobile-move-menu and removes the eventListener.
 */
function closeMoveMenu() {
    removeClasslist('mobileMove', 'd-none');
    window.removeEventListener('click', eventListenerMoveBtn);
}


/**
 * Support function for eventlistener, to listen for clicks outside the opend mobile-move-menu.
 */
function eventListenerMoveBtn(e) {
    if (window.innerWidth < 992) {
        if (!document.getElementById('mobileMove').contains(e.target)) {
            closeMoveMenu();
        }
    }
}


/**
 * This function removes d-none Class from all Droppable-Space divs.
 */
function showDropableSpace() {
    removeClasslist('todo-drop-help', 'd-none');
    removeClasslist('progress-drop-help', 'd-none');
    removeClasslist('feedback-drop-help', 'd-none');
    removeClasslist('done-drop-help', 'd-none');
}


/**
 * This function add d-none Class from all Droppable-Space divs.
 */
function hideDropableSpace() {
    showCardColumnDivs();
    addClasslist('todo-drop-help', 'd-none');
    addClasslist('progress-drop-help', 'd-none');
    addClasslist('feedback-drop-help', 'd-none');
    addClasslist('done-drop-help', 'd-none');
}


/**
 * This function remove Class d-none from all Card-Column divs.
 */
function showCardColumnDivs() {
    for (let i = 0; i < todos.length; i++) {
        const divId = todos[i].id;
        document.getElementById(divId).classList.remove('d-none');
    }
}