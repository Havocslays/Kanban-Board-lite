// let draggedCard = null;

let rightClickedCard = null;

document.addEventListener("DOMContentLoaded",loadTasksFromLocalStorage);

function addTask(columnId) {
    const input = document.getElementById(`${columnId}-input`);
    const taskText = input.value.trim();
    console.log(taskText);

    if(taskText === "") return;

    const taskDate = new Date().toLocaleString();
    const taskElement = createTaskElement(taskText, taskDate)

    document.getElementById(`${columnId}-tasks`).appendChild(taskElement);

    updateTasksCount(columnId);

    saveTasksToLocalStorage(columnId,taskText,taskDate);

    input.value = "";
    
}

function createTaskElement(taskText, taskDate) {
    const element = document.createElement("div");  // remember: taskElement is differnt from above fn u can name anything if u want
    element.innerHTML = `<span>${taskText}</span><br><small class ="time">${taskDate}</small>`;
    element.classList.add("card");
    // element.setAttribute("draggable", true);
    element.draggable = true;        // u can either use above code or this one

    element.addEventListener("dragstart", dragStart);
    element.addEventListener("dragend", dragEnd);
    element.addEventListener("contextmenu", function(event){              // this reference wont work on arrow function
        event.preventDefault();
        rightClickedCard = this;
        showContextMenu(event.pageX, event.pageY);
    });

    return element;
}

function dragStart() {
    this.classList.add("dragging");
    // draggedCard = this;
}

function dragEnd() {
    this.classList.remove("dragging");
    // draggedCard = null;
    ["todo", "doing", "done"].forEach((columnId) => {
        updateTasksCount(columnId)
        updateLocalStorage();
    })
}

const columns = document.querySelectorAll(".column .task")
columns.forEach((column) => {
    column.addEventListener("dragover",dragOver);
});

function dragOver(event) {
    event.preventDefault();
    // const draggedCard = document.getElementsByClassName("dragging")[0];  // comment these lines to use it = 33, 38.
    const draggedCard = document.querySelector(".dragging")         // comment these lines to use it = 33, 38.
    this.appendChild(draggedCard);

    //Dragging and sorting
    const afterElement = getDragAfterElement(this,event.pageY);

    if(afterElement === null){
        this.appendChild(draggedCard);
    }else {
        this.insertBefore(draggedCard, afterElement);
    }
}
function getDragAfterElement(container, y) {
    
       const draggableElements = [...container.querySelectorAll(".card:not(.dragging)")];
       // above returns Nodelist => array      // nodelist doesnt work in reduce


       const result = draggableElements.reduce((closestElementUnderMouse, currentTask) => {
        const box = currentTask.getBoundingClientRect();
           const offset = y - (box.top + box.height / 2);
        // const offset = y - box.top - box.height / 2;     // u can write either this one or above
        if(offset < 0 && offset > closestElementUnderMouse.offset) {
            return {offset : offset, element: currentTask};
        } else {
            return closestElementUnderMouse;
        }
       }, {offset: Number.NEGATIVE_INFINITY}
    );
       return result.element;
}




// function dragOver(event) {
//     event.preventDefault();
//     if (draggedCard && draggedCard !== this.lastElementChild) {
//         this.appendChild(draggedCard);
//     }
// }

const contextmenu = document.querySelector(".context-menu")
function showContextMenu(x, y) {
    contextmenu.style.left = `${x}px`;
    contextmenu.style.top = `${y}px`;
    contextmenu.style.display = "block";
}

document.addEventListener("click", () => {
    contextmenu.style.display = "none";
})

function editTask() {
    if(rightClickedCard !== null){
        const newtaskText = prompt("Edit Task", rightClickedCard.textContent)
        if(newtaskText !== "") {
            rightClickedCard.textContent = newtaskText;
            updateLocalStorage();
        }
    }
}

function deleteTask() {
    if(rightClickedCard !== null){
        const columnId = rightClickedCard.parentElement.id.replace("-tasks","");

        rightClickedCard.remove();

        updateTasksCount(columnId);
        updateLocalStorage();
    }
}

function updateTasksCount(columnId) {
    const count = document.querySelectorAll(`#${columnId}-tasks .card`).length;
    document.getElementById(`${columnId}-count`).textContent = count;
}

//Local Storage

function saveTasksToLocalStorage(columnId,taskText,taskDate) {
    const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
    tasks.push({text: taskText, date: taskDate});
    localStorage.setItem(columnId, JSON.stringify(tasks));            // local storage doesnt store object form that is y we use json.stringify
}

function loadTasksFromLocalStorage() {
    ["todo", "doing", "done"].forEach((columnId) => {
        const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
        tasks.forEach(({text, date}) => {
            const taskElement = createTaskElement(text, date);
            document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
        });
        updateTasksCount(columnId);
    });
}

function updateLocalStorage() {
    ["todo", "doing", "done"].forEach((columnId) => {
        const tasks = [];
        document.querySelectorAll(`#${columnId}-tasks .card`).forEach((card) => {
            const taskText = card.querySelector("span").textContent;
            const taskDate = card.querySelector("small").textContent;
            tasks.push({text: taskText, date: taskDate});
        });
        localStorage.setItem(columnId, JSON.stringify(tasks));
    });
}




// Select the board container

// const boardContainer = document.querySelector(".board");

// Create the 'Create Board' button

// const createBoardBtn = document.createElement("button");
// createBoardBtn.textContent = "Create Board";
// createBoardBtn.classList.add("create-board-btn");
// document.body.insertBefore(createBoardBtn, boardContainer);

// Function to create a new board

// toggleBoardCreation = () => {
//     const boardName = prompt("Enter board name:");
//     if (boardName && boardName.trim() !== "") {
//         createBoard(boardName.trim());
//     }
// };

// Event listener for the button

// createBoardBtn.addEventListener("click", toggleBoardCreation);

// Function to create a board dynamically

// function createBoard(name) {
//     const newBoard = document.createElement("div");
//     newBoard.classList.add("column");
//     newBoard.id = name.toLowerCase().replace(/\s+/g, "-");

//     newBoard.innerHTML = `
//         <h2>${name} (<span id="${newBoard.id}-count">0</span>)</h2>
//         <div class="task" id="${newBoard.id}-tasks"></div>
//         <input type="text" class="task-input" id="${newBoard.id}-input" placeholder="Add a Task">
//         <button class="add-task" onclick="addTask('${newBoard.id}')">Add Task</button>
//     `;
    
//     boardContainer.appendChild(newBoard);
// }



