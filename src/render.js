import { projectList, createProject, openProject, deleteProject, createTask, deleteTask, editTask, checkTask, getUndoneTasks} from ".";
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
        card.append(btnCreateTask);
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
        const menuItemHome = document.querySelector('.item-home > .item-name');
        const menuItemToday = document.querySelector('.item-today > .item-name');
        const menuItemWeek = document.querySelector('.item-week > .item-name');
        const items = document.querySelectorAll('.item-name');

        items.forEach(item => {
            item.classList.remove('active');
        });

        if (typeof(projectList.current) === 'string') { 
            document.querySelector(`.item-${projectList.current} > .item-name`).classList.add('active') 
        }
        if (isDefault()) menuItemHome.classList.add('active');

        menuItemHome.onclick = all;
        menuItemToday.onclick = today;
        menuItemWeek.onclick = week;
        menuProjects.innerHTML = '';
        for (let project of projectList.projects) {
            menuProjects.append(createProjectItem(project));
        }
        
        // hide the 'default' project
        menuProjects.removeChild(menuProjects.firstElementChild);
        
        console.log(`You are now in project "${projectList.current}"`)
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
    const removeIcon = document.createElement('span');
    removeIcon.classList.add("material-symbols-outlined");
    removeIcon.textContent = 'delete';
    const itemCounter = createDiv('item-counter');
    itemCounter.textContent = getUndoneTasks(project);
    itemCounter.textContent == '0' ? itemCounter.classList.remove('acitve') :
                                     itemCounter.classList.add('active')
    divLeft.append(itemName, removeIcon);
    divRight.append(itemCounter);
    projectItem.append(divLeft, divRight);
    projectItem.addEventListener('click',() => {
        openProject(project)
    });
    removeIcon.addEventListener('click', (e) => {
        e.stopPropagation()
        deleteProject(project)
        console.log(e.target)
    });
    return projectItem;
}

(function() {
    const btnAddProject = document.querySelector('.add-project');
    const btnCancelCreateProject = document.querySelector('#btnCancelCreateProject');
    const formAddProject = document.querySelector('.form-add-project');
    const newProjectInput = document.querySelector('#newProjectInput');
    const btnCreateProject = document.querySelector('#btnCreateProject');

    const show = function() {
        btnAddProject.classList.remove('active');
        formAddProject.classList.add('active');
        newProjectInput.focus();
    }
    const cancel = function() {
        btnAddProject.classList.add('active');
        formAddProject.classList.remove('active');
        resetInput();
    }
    const resetInput = function() {
        newProjectInput.value = '';
    }

    btnAddProject.onclick = () => show();
    btnCancelCreateProject.onclick = () => cancel();
    btnCreateProject.addEventListener('click', () => {
        createProject(newProjectInput.value.trim());
        cancel();
    })
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
    card.classList.add(`${task.priority}`);
    if (task.done) card.classList.add('done');
    else card.classList.remove('done');
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
    title.textContent = task.title;
    if (task.done) title.style.textDecoration = 'line-through';
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
        dialogTitle.textContent = 'New task'
        btnSubmit.textContent = 'Create task'
        btnSubmit.onclick = () => {
        createTask(title.value.trim(), dueDate.value, priority.value, details.value.trim(), false);
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
        priority.value = task.priority;
        btnSubmit.onclick = () =>  {
            task.title = title.value;
            task.details = details.value;
            task.dueDate = dueDate.value;
            task.priority = priority.value;
            editTask();
            formCreateTask.reset();
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
                    
    priority.textContent = task.priority;
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




