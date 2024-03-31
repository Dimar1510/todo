import { projectList, createProject, openProject, deleteProject, createTask, deleteTask, editTask, checkTask, getUndoneTasks, editProject} from ".";
import { format, compareAsc } from "date-fns";

export const Render = function() {
    const content = document.querySelector('.content'); 
    const createFirstCard = function() {
        if (typeof(projectList.current) === 'string') return;
        const card = createDiv('task-card');
        const btnCreateTask = document.createElement('button');
        btnCreateTask.id = "btnCreate";
        btnCreateTask.onclick = () => showDialog.create();
        btnCreateTask.innerHTML = '<span class="material-symbols-outlined">add</span> <span>Add task</span>'
        card.append(btnCreateTask)

        const btnEditProject = document.createElement('button');
        btnEditProject.innerHTML = '<span class="material-symbols-outlined">delete</span> <span>Delete project</span>'
        btnEditProject.onclick = () => {
        for (let project of projectList.projects) {
                if (project === projectList.current) {
                    deleteProject(project)
                }
            }
        }
        if (!isDefault()) card.append(btnEditProject)
        content.append(card);
    }

    const updateCounter = function () {
        const counterHome = document.querySelector('.item-home > .item-counter');
        let total = 0;
        for (let project of projectList.projects) {
            total += getUndoneTasks(project);
        }
        total === 0 ? counterHome.classList.remove('active') :
                      counterHome.classList.add('active')
        counterHome.textContent = total;
      
        const counterToday = document.querySelector('.item-today > .item-counter');
        let countToday = 0;
        const today = format(new Date(), "dd/MM/yy");
        for (let project of projectList.projects) {
            for (let task of project.tasks) {
                if (task.dueDate == "") continue;
                if (format(task.dueDate, "dd/MM/yy") === today && !task.done) {
                    countToday += 1;
                    } 
                } 
        }
        countToday === 0 ? counterToday.classList.remove('active') :
                           counterToday.classList.add('active')
        counterToday.textContent = countToday;

        const counterWeek = document.querySelector('.item-week > .item-counter');
        let countWeek = 0;
        const thisWeek = format(new Date(), "w");
        for (let project of projectList.projects) {
            for (let task of project.tasks) {
                if (task.dueDate == "") continue;
                if (format(task.dueDate, "w") === thisWeek && !task.done) {
                    countWeek += 1;
                }
            }
        }
        countWeek === 0 ? counterWeek.classList.remove('active') :
                           counterWeek.classList.add('active')
        counterWeek.textContent = countWeek;
    };

    const sidebar = function () {
        const menuProjects = document.querySelector('.menu-projects');
        const menuItemHome = document.querySelector('.item-home');
        const menuItemToday = document.querySelector('.item-today');
        const menuItemWeek = document.querySelector('.item-week');
        const items = document.querySelectorAll('.item-name');
        const notes = document.querySelector('.item-notes')

        // implement notes later
        notes.onclick = () => {
            projectList.current = 'notes'
            console.log(projectList.current)
            content.innerHTML = '<h3>Page is under construction<br>Check again later!</h3>';
            sidebar();
        }
        
        // end

        items.forEach(item => {
            item.classList.remove('active');
        });

        if (typeof(projectList.current) === 'string') { 
            document.querySelector(`.item-${projectList.current} > .item-name`).classList.add('active') 
        }
        if (isDefault()) menuItemHome.firstElementChild.classList.add('active');

        menuItemHome.onclick = all;
        menuItemToday.onclick = today;
        menuItemWeek.onclick = week;


        menuProjects.innerHTML = '';
        for (let project of projectList.projects) {
            menuProjects.append(createProjectItem(project));
        }
        
        // hide the 'default' project
        menuProjects.removeChild(menuProjects.firstElementChild);
        
        // console.log(`You are now in project ${projectList.current}"`)
    };

    const project = function() {
        content.innerHTML = '';
        createFirstCard();
        updateCounter();
        if (isDefault()) {
            for (let project of projectList.projects) {
                for (let task of project.tasks) {
                    content.append(createCard(task, project));
                }
            }
            sidebar();
            return;
        } 
        if (projectList.current === 'today') {
            today();
            return;
        }
        if (projectList.current === 'week') {
            week();
            return;
        }
        for (let task of projectList.current.tasks) {
            content.append(createCard(task, projectList.current));
            }
        if (content.childElementCount <= 1) {
            const noprojects = document.createElement('h3');
            noprojects.innerHTML = 'There are no tasks here...<br>Lets add some!'
            content.appendChild(noprojects);
        }
        sidebar();
    }

    const all = function() {
        openProject(projectList.projects[0]);

    }

    const today = function() {
        projectList.current = 'today';
        const today = format(new Date(), "dd/MM/yy");
        content.innerHTML = '';
        for (let project of projectList.projects) {
            for (let task of project.tasks) {
                if (task.dueDate == "") continue;
                if (format(task.dueDate, "dd/MM/yy") === today) {
                    content.append(createCard(task, project));
                    } 
                } 
        }
        if (content.innerHTML === '') {
            content.innerHTML = "<h3>Tasks for today will be here</h3>"
        }
        sidebar();

    } 

    const week = function() {
        projectList.current = 'week';
        const thisWeek = format(new Date(), "w");
        content.innerHTML = '';
        for (let project of projectList.projects) {
            for (let task of project.tasks) {
                if (task.dueDate == "") continue;
                if (format(task.dueDate, "w") === thisWeek) content.append(createCard(task, project));
            }
        }
        if (content.innerHTML === '') {
            content.innerHTML = "<h3>Tasks for this week will be here</h3>"
        }
        sidebar();
        
    }

    const isDefault = function() {
        return projectList.current === projectList.projects[0];
    }


    return {project};
}();


function createDiv(className) {
    const div = document.createElement('div');
    div.classList.add(className);
    return div;
}


// Render project grid --------------------------------------------------


function createProjectItem(project) {
    const projectItem = document.createElement('li');
    projectItem.classList.add('project-item');
    const divLeft = document.createElement('div');
    const divRight = document.createElement('div');
    const itemName = createDiv('item-name');
    itemName.textContent = project.name;
    project === projectList.current ? itemName.classList.add('active') : itemName.classList.remove('active');

    const editIcon = document.createElement('span');
    editIcon.classList.add("material-symbols-outlined");
    editIcon.textContent = 'edit_square';

    // const removeIcon = document.createElement('span');
    // removeIcon.classList.add("material-symbols-outlined");
    // removeIcon.textContent = 'delete';

    const itemCounter = createDiv('item-counter');
    itemCounter.textContent = getUndoneTasks(project);
    itemCounter.textContent == '0' ? itemCounter.classList.remove('acitve') :
                                     itemCounter.classList.add('active')
    divLeft.append(itemName, editIcon);
    divRight.append(itemCounter);
    projectItem.style.borderLeftColor = project.color;
    projectItem.append(divLeft, divRight);
    projectItem.addEventListener('click',() => {
        openProject(project)
    });
    editIcon.addEventListener('click', (e) => {
        e.stopPropagation()
        projectCreation.show(project)
    })
    // removeIcon.addEventListener('click', (e) => {
    //     e.stopPropagation()
    //     deleteProject(project)
    // });
    return projectItem;
}

// project creation --------------------------------------------------

const projectCreation = (function() {
    const btnAddProject = document.querySelector('.add-project');
    const btnCancelCreateProject = document.querySelector('#btnCancelCreateProject');
    const formAddProject = document.querySelector('.form-add-project');
    const newProjectInput = document.querySelector('#newProjectInput');
    const btnCreateProject = document.querySelector('#btnCreateProject');
    let projectColor = 'black'
    const iconChecked = `<span class="material-symbols-outlined">done</span>`;

    const show = function(project) {
        btnAddProject.classList.remove('active');
        formAddProject.classList.add('active');
        colorPalette();
        newProjectInput.focus();
        if (project) {
            edit(project)
        } else create();
    }
    const cancel = function() {
        btnAddProject.classList.add('active');
        formAddProject.classList.remove('active');
        resetInput();
    }

    const edit = function(project) {
        btnCreateProject.textContent = 'Confirm';
        newProjectInput.value = project.name;
        const colorCard = document.getElementById(project.color);
        clearCheck()
        colorCard.innerHTML = iconChecked;
        btnCreateProject.onclick = () => {
            if (newProjectInput.value.trim() === '') {
                newProjectInput.style.borderColor = 'red';
                setTimeout(() => newProjectInput.style.borderColor = 'black', 1500)
                return;
            }
            editProject(project, newProjectInput.value.trim(), projectColor)
            cancel();
        }
    }

    const create = function() {
        btnCreateProject.textContent = 'Add';
        btnCreateProject.onclick = () => {
            if (newProjectInput.value.trim() === '') {
                newProjectInput.style.borderColor = 'red';
                setTimeout(() => newProjectInput.style.borderColor = 'black', 1500)
                return;
            }
            createProject(newProjectInput.value.trim(), projectColor);
            cancel();
        }
    }

    const resetInput = function() {
        newProjectInput.value = '';
    }

    function colorPalette(){
        const colorArray = ['black','red','blue','green','orange','purple','aqua','maroon'];
        const colorSelector = document.querySelector('.color-selector');
        colorSelector.innerHTML = "";
        for (let color of colorArray) {
            const colorCard = createDiv('color-card');
            colorCard.id = color;
            colorCard.style.backgroundColor = color;
            if (color === 'black') colorCard.innerHTML = iconChecked;
            colorCard.onclick = (e) => {
                checkColor(e.target);
            }
            colorSelector.appendChild(colorCard);
        }
    }

    function clearCheck() {
        const colorCards = document.querySelectorAll('.color-card');
        colorCards.forEach(card => {
            card.innerHTML = ''
        });
    }

    function checkColor(pickedCard) {
        if (pickedCard.id === '') return;
        clearCheck()
        pickedCard.innerHTML = iconChecked;
        projectColor = pickedCard.id;
    }


    btnAddProject.onclick = () => show();
    btnCancelCreateProject.onclick = () => cancel();

    return {show}
})();


// Render tasks grid --------------------------------------------------

function createCard(task, project) {
    const card = createDiv('task-card');
    const divLeft = createDiv('card-left');
    const divRight = createDiv('card-right');

    divLeft.append(
      createCardCheckbox(task), 
      createCardTitle(task)
    );
    divRight.append(
      createCardDetailsBtn(task), 
      createCardDate(task), 
      createCardEditBtn(task), 
      createCardRemoveBtn(task, project)
    );
    card.append(divLeft, divRight);
    if (task.done) card.classList.add('done');
    else card.classList.remove('done');
    card.style.borderLeftColor = project.color;
    return card;
}
  
function createCardCheckbox(task) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'card-checkbox'
    task.done ? checkbox.checked = true : checkbox.checked = false;
    checkbox.addEventListener('change', () => {
        checkTask(checkbox, task);
    })
    return checkbox;
}

function createCardTitle(task) {
    const title = document.createElement('span');
    task.priority ? title.innerHTML = `<span class="material-symbols-outlined">priority_high </span><span>${task.title}</span>` :
    title.innerHTML = `<span>${task.title}</span>`
    if (task.done) title.lastElementChild.style.textDecoration = 'line-through';
    return title;
}

function createCardDetailsBtn(task) {
    const btnDetails = document.createElement('button');
    btnDetails.textContent = 'details';
    btnDetails.onclick = () => showDialogDetails(task);
    return btnDetails;
}

function createCardDate(task) {
    const dueDate = createDiv('card-date');
    if (task.dueDate == "") {
        dueDate.textContent = 'no date';
        return dueDate;
    }
    dueDate.textContent = format(task.dueDate, "dd LLL");
    if (compareAsc(task.dueDate, format(new Date(), 'dd LLL yy')) < 0) 
    {
        dueDate.style.color = 'red'
    }
    if (task.done) dueDate.style.color = '#b5b5b5';
    return dueDate;
}

function createCardEditBtn(task) {
    const edit = document.createElement('span');
    edit.classList.add('material-symbols-outlined')
    edit.innerHTML = 'edit_square</span>';
    edit.onclick = () => showDialog.edit(task);
    return edit;
}

function createCardRemoveBtn(task, project) {
    const remove = document.createElement('span');
    remove.classList.add('material-symbols-outlined')
    remove.innerHTML = 'delete';
    remove.onclick = () => deleteTask(task, project);
    return remove;
}


// DIALOG CREATE
const showDialog = function() {
    const dialogCreateTask = document.querySelector('.dialog-create');
    dialogCreateTask.addEventListener("click", e => {
        const dialogDimensions = dialogCreateTask.getBoundingClientRect()
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dialogCreateTask.close();
            formCreateTask.reset();
        }
    })
    const formCreateTask = document.querySelector('form');
    const title = document.getElementById('form-title');
    const details = document.getElementById('form-details');
    const dueDate = document.getElementById('form-date');
    const priority = document.getElementById('priority-select');
    const btnSubmit = document.getElementById('btnSubmit');
    const dialogTitle = document.querySelector('.dialog-create > .dialog-header > h2');
    const buttonClose = document.querySelector('.dialog-create > .dialog-header > span');
    buttonClose.onclick = () => dialogCreateTask.close();

    const create = function() {
        dialogCreateTask.showModal();
        dialogTitle.textContent = 'New task';
        btnSubmit.textContent = 'Create task';
        btnSubmit.onclick = () => {
        createTask(title.value.trim(), dueDate.value, priority.checked, details.value.trim(), false);
        formCreateTask.reset();
        } 
    }

    const edit = function(task) {
        dialogCreateTask.showModal();
        dialogTitle.textContent = 'Edit task'
        btnSubmit.textContent = 'Confirm edit'
        title.value = task.title;
        details.value = task.details;
        dueDate.value = task.dueDate;
        priority.checked = task.priority;
        btnSubmit.onclick = () =>  {
            task.title = title.value;
            task.details = details.value;
            task.dueDate = dueDate.value;
            task.priority = priority.checked;
            editTask();
        }
        
    }
    return {create, edit};
}();

// DIALOG DETAILS
const showDialogDetails = function(task) {
    const dialog = document.querySelector('.dialog-details');  
    const project = document.querySelector('#details-project');
    const date = document.querySelector('#details-date');
    const priority = document.querySelector('#details-priority');
    const text = document.querySelector('#details-text');
    const dialogTitle = document.querySelector('.dialog-details > .dialog-header > h4');
    const buttonClose = document.querySelector('.dialog-details > .dialog-header > span');
    buttonClose.onclick = () => dialog.close();

    dialog.showModal();
    dialogTitle.textContent = task.title;
    project.textContent = task.project;
    task.dueDate != "" ? date.textContent = format(task.dueDate, "dd.LL.yyyy") :
                         date.textContent = "no date";
                    
    task.priority ? priority.textContent = "high" : 
                    priority.textContent = "normal";

    task.details != "" ? text.textContent = task.details :
                         text.textContent = 'no additional details'


    dialog.addEventListener("click", e => {
        const dialogDimensions = dialog.getBoundingClientRect()
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dialog.close()
        }
    })
};




