/*----------- EDIT TASK FROM BOARD -----------*/
/**
 * The function loads the edit form for the task that is currently in detail view. The function sets a couple of variables which are given
 * as parameters to the renderEditCard() function. The variables represent the current values of the selected task. It also sets the current
 * priority and loads all contacts that are currently assigend to the task.
 * 
 * @param {number} id - id of current todo
 */
function editTask(id) {
    let title = todos[id].title;
    let description = todos[id].description;
    let date = todos[id].date;
    renderEditCard(id, title, description, date);
    setCurrentPriority(id);
    loadAssignments(id);
    loadSubtasksAtEdit(id);
    editTaskOpen = true;
    window.removeEventListener('click', handleClickEvent);
    setTimeout(() => {
        window.addEventListener('click', handleClickEvent);
    }, 10);
}


/**
 * The function sets the priority variable to the priority of the current task. It the runs the correct function to highlight the priority
 * that is currently selected.
 * 
 * @param {number} id - id of current todo
 */
function setCurrentPriority(id) {
    let priority = todos[id].priority;
    if (priority == 'urgent') {
        taskIsUrgent('urgent', 'urgent_big', 'medium', 'low');
    }
    if (priority == 'medium') {
        taskIsMedium('medium', 'medium_big', 'low', 'urgent');
    }
    if (priority == 'low') {
        taskIsLow('low', 'low_big', 'urgent', 'medium');
    }
}


/**
 * The function loads all assignment options and current assignments. It also assigns the currently assigned contacts.
 * 
 * @param {number} id - id of current todo
 */
function loadAssignments(id) {
    pushAssignedContactsToAssignments(id);
    loadAssignmentOptions();
    assignAssignedContacts(id);
}


/**
 * The function loads the Subtasks at the edit window at the board.
 * 
 * @param {number} id - Number of the todo that is edited
 */
function loadSubtasksAtEdit(id) {
    pushSubtasksToSubtasks(id);
    loadSubtasks();
}


/**
 * The function pushes all subtasks from a specific task to the subtasks array.
 * 
 * @param {number} id - id of the specific task
 */
function pushSubtasksToSubtasks(id) {
    for (let i = 0; i < todos[id].subtasks.length; i++) {
        const option = todos[id].subtasks[i];
        subtasks.push(option);
    }
}


/**
 * The function loops through the assignments of the current task. If the current contact in the loop is not included at the assignments
 * array, the contact is pushed to the assignments array.
 * 
 * @param {number} id - id of current todo
 */
function pushAssignedContactsToAssignments(id) {
    for (let i = 0; i < todos[id].assignments.length; i++) {
        const option = todos[id].assignments[i];
        if (assignments.every(a => a.firstName !== option.firstName) && assignments.every(a => a.lastName !== option.lastName)) {
            assignments.push(option);
        }
    }
}


/**
 * The function assigns all contacts of the assignments array that match a contact from the assignments of the current task.
 * 
 * @param {number} id - id of current todo
 */
function assignAssignedContacts(id) {
    for (let i = 0; i < assignments.length; i++) {
        const assignment = assignments[i];
        if (todos[id].assignments.some(a => a.firstName == assignment.firstName) && todos[id].assignments.some(a => a.lastName == assignment.lastName)) {
            assignContact(i);
        }
    }
}


/**
 * The function saves all changes to the backend if all inputs are valid
 * 
 * @param {number} id - id of the todo which got edited
 */
function saveChanges(id) {
    detailViewOpen = true;
    editTaskOpen = false;
    checkIfInvalidInput()
    checkIfInputMissingAndPushEditedTask(id);
    saveToBackend();
    window.removeEventListener('click', handleClickEvent);
    setTimeout(() => {
        window.addEventListener('click', handleClickEvent);
    }, 10);
}


/**
 * The function checks if any input-field is empty or the selected date lies in the past. If any input field is empty it resolves in setting
 * the inputMissing variable to true.
 * 
 */
function checkIfInvalidInput() {
    setInputMissingToFalse();
    checkIfEmpty('title');
    checkIfEmpty('description');
    checkDate();
    //checkIfNotAssigned();
    checkIfNoPriority();
}


/**
 * The function checks the inputMissing variable. If the variable is set to false, meaning no input is missing, the changes are saved to the
 * backend database and the edit window is closed.
 * 
 * @param {number} id - id of the todo which got edited
 */
function checkIfInputMissingAndPushEditedTask(id) {
    if (inputMissing == false) {
        pushChanges(id);
        setTimeout(() => {
            unsetPriorityOnly();
        }, 100);
    }
}


/**
 * The function unsets all priorities when the edit todo window is closed.
 */
function unsetPriorityOnly() {
    urgent = false;
    medium = false;
    low = false;
}


/**
 * The function gets all the values present in the input-fields at the edit todo card and saves them to the backend database. Also the edit
 * card window is closed and the detail card is shown again.d
 * 
 * @param {number} id - id of the todo which got edited
 */
function pushChanges(id) {
    updateTodo(id, 'title');
    updateTodo(id, 'description');
    updateTodo(id, 'date');
    getPriority();
    setPriority(id);
    getNewAssignments(id);
    showTaskCard(id);
    saveEditedSubtasks(id);
}


/**
 * Updates the title, description, or date of a todo item in an array called "todos".
 * @param {number} id - The ID of the todo item to be updated.
 * @param {string} type - The type of todo item to be updated. Can be "title", "description", or "date".
 */
function updateTodo(id, type){
    if (type === 'title') {
        todos[id].title = document.getElementById('title').value;
    }
    if (type === 'description') {
        todos[id].description = document.getElementById('description').value;
    }
    if (type === 'date') {
        todos[id].date = document.getElementById('date').value;
    }
}


/**
 * The function sets the priority of the edited todo.
 * 
 * @param {number} id - id of current todo
 */
function setPriority(id) {
    todos[id].priority = priority;
}


/**
 * The function empties the assignments array of the current todo. It then loops through the assignedContacts array and pushes the contacts
 * to the assignments array of the current todo. It finishes by emptying the assignedContacts
 * 
 * @param {number} id - id of current todo
 */
function getNewAssignments(id) {
    todos[id].assignments = [];
    for (let i = 0; i < assignedContacts.length; i++) {
        const contact = assignedContacts[i];
        todos[id].assignments.push(contact);
    }
    assignedContacts = [];
}


/**
 * The function empties the subtasks array of the current todo. It then loops through the subtasks array and pushes the subtasks
 * to the subtasks array of the current todo. It finishes by emptying the subtasks array.
 * 
 * @param {number} id - id of current todo
 */
function saveEditedSubtasks(id) {
    todos[id].subtasks = [];
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        todos[id].subtasks.push(subtask);
    }
    subtasks = [];
}