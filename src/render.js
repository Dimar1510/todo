import { projectList, createProject, openProject, deleteProject, createTask, deleteTask, editTask, checkTask, getUndoneTasks, editProject, hasTask} from ".";
import { format, compareAsc } from "date-fns";

export const Render = function() {
    const content = document.querySelector('.content'); 
    const createFirstCard = function() {
        if (typeof(projectList.current) === 'string') return;
        const card = createDiv('task-card');
        const btnCreateTask = document.createElement('button');
        btnCreateTask.id = "btnCreate";
        btnCreateTask.onclick = () => {
            showDialog.create();
        }
        btnCreateTask.innerHTML = '<span class="material-symbols-outlined">add</span> <span>Add task</span>'
        card.append(btnCreateTask)

        const btnDeleteProject = document.createElement('button');
        btnDeleteProject.innerHTML = '<span class="material-symbols-outlined">delete</span> <span>Delete project</span>'
        btnDeleteProject.onclick = () => {
        for (let project of projectList.projects) {
                if (project === projectList.current) {
                    showConfirmDeleteProject(project)
                }
            }
        }
        if (!isDefault()) card.append(btnDeleteProject)
        content.append(card);
        if (isDefault()) card.append(createSortSelector())
    }

    const projectTitle = function(title) {
        const titleDiv = document.querySelector('.project-title');
        const titleColor = document.querySelector('.title-color');
        if (!title) {
            titleDiv.textContent = projectList.current.name
            titleColor.style.backgroundColor = projectList.current.color;
        }
        else {
            titleDiv.textContent = title;
            titleColor.style.backgroundColor = null;
        }

        
    }

    const createSortSelector = function() {
        const sort = createDiv('sortBtns');
        let method = ''
        const text = document.createElement('div');
        text.textContent = 'Sort by:';

        const def = document.createElement('span');
        def.classList.add('material-symbols-outlined');
        def.textContent = 'colors';
        if (projectList.sorting === '') def.classList.add('active')
        def.onclick = () => {
            method = '';
        }

        const name = document.createElement('span');
        name.classList.add('material-symbols-outlined');
        name.textContent = 'Sort_By_Alpha';
        if (projectList.sorting === 'name') name.classList.add('active')
        name.onclick = () => {
            method = 'name';
        }

        const date = document.createElement('span');
        date.classList.add('material-symbols-outlined');
        date.textContent = 'pending_actions';
        if (projectList.sorting === 'date') date.classList.add('active')
        date.onclick = () => {
            method = 'date';
        }

        const important = document.createElement('span');
        important.classList.add('material-symbols-outlined');
        important.textContent = 'priority_high';
        if (projectList.sorting === 'important') important.classList.add('active')
        important.onclick = () => {
            method = 'important';
        }
        
        const btns = [def, name, important, date]

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (projectList.sorting === method) {
                    projectList.reverseOrder ? projectList.reverseOrder = false : projectList.reverseOrder = true;
                } 
                else {
                    projectList.sorting = method;
                    projectList.reverseOrder = false;
                }                
                editTask();
            })
        });

        sort.append(text, def, name, important, date); 
        return sort;
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
        // const notes = document.querySelector('.item-notes')

        // implement notes later
        // notes.onclick = () => {
        //     projectList.current = 'notes'
        // }

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

        // for mobile
        const itemsOnMobile = document.querySelectorAll('.nav')
        itemsOnMobile.forEach(item => {
            item.addEventListener('click', () => {
                mobileMenu.hide();
            })
        });
    };

    const project = function() {
        content.innerHTML = '';
        const cards = [];
        createFirstCard();
        updateCounter();
        projectTitle();
        if (isDefault()) {
            projectTitle('TDL // All tasks')
            for (let project of projectList.projects) {
                for (let task of project.tasks) {
                    cards.push({task, project})
                }
            }
            // sorting
            // important first
            if (projectList.sorting === 'important') cards.sort((a) => (a.task.priority) ? -1 : 1)
            // upcoming
            if (projectList.sorting === 'date') cards.sort((a,b) => {
                (compareAsc(a.task.dueDate, b.task.dueDate)) < 0 ? -1 : 1
                if (a.task.dueDate === '') return -1;
            })
            // name
            if (projectList.sorting === 'name') cards.sort((a,b) => (a.task.title < b.task.title) ? -1 : 1)

            if (projectList.reverseOrder) cards.reverse();
        

            for (let card of cards) {
                content.append(createCard(card.task, card.project));
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
        projectTitle('Tasks for today')
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
        projectTitle('Tasks for this week')
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

// menu btn

const mobileMenu = function() {
    const menuBtn = document.querySelector('.hamburger');
    const container = document.querySelector('.main-container');
    const hide = function() {
        container.classList.remove('show');
    }
    
    menuBtn.onclick = () => {
        container.classList.toggle('show');
        
    }
    return {hide}
}()

// Render project grid

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

    const itemCounter = createDiv('item-counter');
    itemCounter.textContent = getUndoneTasks(project);
    itemCounter.textContent == '0' ? itemCounter.classList.remove('acitve') :
                                     itemCounter.classList.add('active')
    divLeft.append(itemName, editIcon);
    divRight.append(itemCounter);
    projectItem.style.borderLeftColor = project.color;
    projectItem.append(divLeft, divRight);
    projectItem.addEventListener('click',() => {
        projectCreation.cancel();
        openProject(project);
        

    });
    editIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        projectCreation.show(project)
    })
    projectItem.classList.add('nav')
    projectItem.onmouseover = () => {
        projectItem.style.boxShadow = `0 1px 1px 0px ${project.color}`
    }
    projectItem.onmouseout = () => {
        projectItem.style.boxShadow = `0 0px 0px 0px ${project.color}`
    }
    return projectItem;
}

// project creation

const projectCreation = (function() {
    const btnAddProject = document.querySelector('.add-project');
    const btnCancelCreateProject = document.querySelector('#btnCancelCreateProject');
    const formAddProject = document.querySelector('.form-add-project');
    const newProjectInput = document.querySelector('#newProjectInput');
    const btnCreateProject = document.querySelector('#btnCreateProject');
    let projectColor = 'white'
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
        formAddProject.firstElementChild.textContent = `Edit project "${project.name}"`
        newProjectInput.value = project.name;
        const colorCard = document.getElementById(project.color);
        clearCheck()
        colorCard.innerHTML = iconChecked;
        btnCreateProject.onclick = () => {
            if (!checkValidity(newProjectInput)) return;
            editProject(project, newProjectInput.value.trim(), projectColor);
            mobileMenu.hide();
            cancel();
        }
    }

    const create = function() {
        btnCreateProject.textContent = 'Add';
        formAddProject.firstElementChild.textContent = 'Add new project'
        btnCreateProject.onclick = () => {
            if (!checkValidity(newProjectInput)) return;
            createProject(newProjectInput.value.trim(), projectColor);
            mobileMenu.hide();
            cancel();
        }
    }

    const resetInput = function() {
        newProjectInput.value = '';
    }

    function colorPalette(){
        const colorArray = ['white','#ff564a','#0043a8','#026134','#f4884d','#982cf1','#c3066e'];
        const colorSelector = document.querySelector('.color-selector');
        colorSelector.innerHTML = "";
        for (let color of colorArray) {
            const colorCard = createDiv('color-card');
            colorCard.id = color;
            colorCard.style.backgroundColor = color;
            if (color === colorArray[0]) colorCard.innerHTML = iconChecked;
            colorCard.onclick = (e) => {
                checkColor(e.target);
            }
            colorSelector.appendChild(colorCard);
            colorSelector.onclick = (e) => {
                e.stopPropagation()
                newProjectInput.focus();
            }
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

    return {show, cancel}
})();


// Render tasks grid

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
      createCardEditBtn(task), 
      createCardRemoveBtn(task, project)
    );
    card.append(divLeft, createCardDate(task), divRight);
    if (task.done) card.classList.add('done');
    else card.classList.remove('done');
    card.style.borderLeftColor = project.color;
    card.onmouseover = () => {
        card.style.boxShadow = `0 0px 1px 1px ${project.color}`
    }
    card.onmouseout = () => {
        card.style.boxShadow = `0 0px 0px 0px ${project.color}`
    }

    // for mobile 
    const show = document.createElement('span');
    show.classList.add('material-symbols-outlined')
    show.innerHTML = 'more_vert';
    show.classList.add('more-btn')
    card.append(show);
    show.onclick = () => {
        divRight.classList.toggle('visible')
    }
    window.addEventListener("click", e => {
        const dialogDimensions = divRight.getBoundingClientRect()
        if (
            e.clientX < dialogDimensions.left || 
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            divRight.classList.remove('visible')
        }
    })
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
    task.priority ? title.innerHTML = `<span class="material-symbols-outlined">Exclamation</span><span>${task.title}</span>` :
    title.innerHTML = `<span>${task.title}</span>`
    if (task.done) title.lastElementChild.style.textDecoration = 'line-through';
    return title;
}

function createCardDetailsBtn(task) {
    // const btnDetails = document.createElement('button');
    // btnDetails.textContent = 'details';
    const btnDetails = document.createElement('span');
    btnDetails.classList.add('material-symbols-outlined')
    btnDetails.innerHTML = 'info';
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
    edit.innerHTML = 'edit_square';
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
    const formCreateTask = document.querySelector('form');
    const title = document.getElementById('form-title');
    const details = document.getElementById('form-details');
    const dueDate = document.getElementById('form-date');
    const priority = document.getElementById('priority-select');
    const btnSubmit = document.getElementById('btnSubmit');
    const dialogTitle = document.querySelector('.dialog-create > .dialog-header > h2');
    const buttonClose = document.querySelector('.dialog-create > .dialog-header > span');
    buttonClose.onclick = () => {
        dialogCreateTask.close();
        formCreateTask.reset();
    };
    priority.onclick = () => {
        priority.classList.toggle('checked');
    }


    const create = function() {
        dialogCreateTask.showModal();
        priority.classList.remove('checked')
        dialogTitle.textContent = 'New task';
        btnSubmit.textContent = 'Create task';
        createList()
        btnSubmit.onclick = (e) => {
            if (!checkValidity(title)) {
                e.preventDefault()
                return;
            }
            const project = selectProject();
            createTask(title.value.trim(), dueDate.value, (priority.classList.contains('checked')), details.value.trim(), project);
            console.log(title.value)
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
        task.priority ? priority.classList.add('checked') :
                        priority.classList.remove('checked');
        priority.checked = task.priority;
        createList(task);
        btnSubmit.onclick = () =>  {
            const newProject = selectProject();
            const project = hasTask(task)
            task.title = title.value;
            task.details = details.value;
            task.dueDate = dueDate.value;
            task.priority = (priority.classList.contains('checked'));
            if (newProject !== project) {
                project.deleteTask(task);
                newProject.addTask(task);
                task.project = newProject.name;
            }
            editTask();
        }  
    }

    dialogCreateTask.addEventListener("click", e => {
        const dialogDimensions = dialogCreateTask.getBoundingClientRect()
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dialogCreateTask.close();
        }
    })
    return {create, edit};
}();

function createList (task) {
    const projectSelect = document.getElementById('task-projects');
    projectSelect.innerHTML = ""
    for (let project of projectList.projects) {
        const option = document.createElement('option');
        option.value = project;
        option.text = project.name;
        option.style.color = project.color;
        projectSelect.add(option);
        if (project === projectList.current || project.tasks.includes(task)) option.selected = true;
    }
}

function selectProject() {
    const projectSelect = document.getElementById('task-projects');
    let selectedProjectIndex = 0;
    for (let i = 0; i < projectSelect.options.length; i++) {
        if (projectSelect.options[i].selected) selectedProjectIndex = i;
    }
    const project = (projectList.projects[selectedProjectIndex]);
    return project;
}


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

// DIALOG CONFIRM DELETE PROJECT
const showConfirmDeleteProject = function(project) {

    const btnDelete = document.getElementById('btnDeleteProject');
    const btnCancel = document.getElementById('btnCancelDeleteProject');
    const dialog = document.querySelector('.dialog-confirm');
    const projectName = document.querySelector('.dialog-confirm > .confirm span');

    btnCancel.onclick = () => dialog.close();
    btnDelete.onclick = () => {
        deleteProject(project);
        dialog.close()
        projectCreation.cancel();
    }

    dialog.showModal();
    projectName.textContent = project.name;
    
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

// validity

function checkValidity(field) {
    if (field.value.trim() === '') {
        field.placeholder = 'Please enter name';
        field.classList.add('error')
        field.focus();
        field.oninput = () => {
            field.placeholder = 'Name';
            field.classList.remove('error');
        }
        return false;
    }
    return true;
}

