window.addEventListener("load", showTasks);

const inputBox = document.querySelector(".input input");
const addBtn = document.querySelector(".input button");
const todoList = document.querySelector(".todoList");
const deleteBtn = document.querySelector("#deleteBtn");
const editBtn = document.querySelector("#editBtn");
const saveBtn = document.querySelector("#saveBtn");
const clearAll = document.querySelector(".clearAll");

const task = document.querySelector(".task");
var taskCounter = 0;
var taskDone = 0;
var taskNotDone = taskCounter;
let taskList;
let checkedTasks = [];

if(!localStorage.getItem("taskList")){
    taskList = [];
}else{
    taskList = getTaskList();
}
if(!localStorage.getItem("checkedTasks")){
    checkedTasks = [];
}else{
    checkedTasks = getCheckedTasks();
}



showReport();
inputBox.addEventListener("keyup", ()=>{
    let userData = inputBox.value;
    if (userData.trim() != 0){
        addBtn.classList.add("active");
    }else{
        addBtn.classList.remove("active");
    }
})


inputBox.addEventListener ("keypress",function(e){

    if (e.keyCode == 13 && inputBox.value){
        e.preventDefault();
        addBtn.click();
    }
})



addBtn.addEventListener ("click" , ()=>{
    if (inputBox.value){
        let userData = inputBox.value;
        let task = createTask(userData);
        
        task.innerHTML = '<span class="tick notDone"><i class="fa-solid fa-check"></i></span>' + userData +
        '<button id="deleteBtn"><i class="fa-solid fa-trash"></i></button><button id="editBtn"><i class="fa-solid fa-pen-to-square"></i></button>'
        todoList.appendChild(task);
        saveTasks(userData);
        task.classList.add("task");
        taskCounter +=1;
        taskNotDone +=1;
        showReport();
        clearAll.classList.add("active");
        inputBox.value = "";
        addBtn.classList.remove("active");
        handle();
    }
})

function createTask(userData){
    let li = document.createElement("li");
    li.textContent = userData;
    return li;
    
}
todoList.addEventListener("mousemove", (e)=>{
    let li = e.target;
    var del = li.children.deleteBtn;
    var edit = li.children.editBtn;
    if (li.className === "task checked"){

    del.style.display = "none";
    edit.style.display = "none";
    }
    
})
todoList.addEventListener("click", (e)=>{
    if (e.target.className === "fa-solid fa-trash"){
        let target = e.target.parentElement.parentElement;
        target.remove();
        taskList.splice(taskList.indexOf(target.textContent), 1);
        localStorage.setItem("taskList", taskList);
        
        if (e.target.parentElement.parentElement.className === "task checked"){
            taskDone -= 1;
        }
        taskCounter = taskList.length + 1;
        taskNotDone = taskCounter - taskDone;
        
        taskCounter -=1;
        taskNotDone -=1;
        if (taskList.length === 0){
            localStorage.removeItem("taskList");
        }
        showReport();
        
    }
    if (e.target.nodeName === "LI"){
        e.target.classList.toggle("checked");
        e.target.firstElementChild.classList.toggle("notDone");
        const li = e.target;
        const del = li.children.deleteBtn;
        const edit = li.children.editBtn;
        
        if (li.className === "task checked"){
            
            del.style.display = "none";
            edit.style.display = "none";
            
            checkedTasks.push(li.innerText);
            localStorage.setItem("checkedTasks", checkedTasks);
            taskDone+=1;
            taskNotDone-=1;
        }else {
            
            checkedTasks.splice(checkedTasks.indexOf(li.textContent), 1);
            
            li.addEventListener('mousemove',function(){
                del.style.display="inline-block";
                edit.style.display="inline-block";
                })
            
            li.addEventListener('mouseleave',function(){
            del.style.display="none";
            edit.style.display="none";
            })
                
            localStorage.setItem("checkedTasks", checkedTasks);
            
            taskDone-=1;
            taskNotDone +=1;
        }
        
        showReport();
    }

    if (e.target.className === "fa-solid fa-check"){
        e.target.parentNode.parentNode.classList.toggle("checked");
        e.target.parentNode.parentNode.firstElementChild.classList.toggle("notDone");

        const li = e.target.parentElement.parentElement;
        const del = li.children.deleteBtn;
        const edit = li.children.editBtn;

        if (li.className === "task checked"){
            
            del.style.display = "none";
            edit.style.display = "none";
            
            checkedTasks.push(li.innerText);
            localStorage.setItem("checkedTasks", checkedTasks);
            taskDone+=1;
            taskNotDone-=1;
        }else {
            
            checkedTasks.splice(checkedTasks.indexOf(li.textContent), 1);
            
            li.addEventListener('mousemove',function(){
                del.style.display="inline-block";
                edit.style.display="inline-block";
                })
            
            li.addEventListener('mouseleave',function(){
            del.style.display="none";
            edit.style.display="none";
            })
                
            localStorage.setItem("checkedTasks", checkedTasks);
            
            taskDone-=1;
            taskNotDone +=1;
        }
        showReport();
    }
    if (taskCounter === 0){
        clearAll.classList.remove("active");
    }
    
    if (e.target.className === "fa-solid fa-pen-to-square"){
        const li = e.target.parentNode.parentNode;
        var taskIndex = taskList.indexOf(e.target.parentNode.parentNode.innerText);
        
        const input = document.createElement("input");
        input.type = "text";
        input.id = "newInput";
        input.value = li.innerText;
        
        li.innerText = "";

        li.innerHTML = `<span class="tick notDone"><i class="fa-solid fa-check"></i></span>
    
        <button id="deleteBtn"><i class="fa-solid fa-trash"></i></button><button id="saveBtn"><i class="fa-solid fa-floppy-disk"></i></button>`;

        li.appendChild(input).focus();

        showReport();
    }
    if (e.target.className === "fa-solid fa-floppy-disk"){
        let newLi = e.target.parentNode.parentNode;
        
        newInput = document.querySelector("#newInput");
        
        let newText = newInput.value;

        let iCounter = 0;
        for (const i of todoList.childNodes) {
            
            if (i !== newLi){

                iCounter+=1;
            }else{
                var index = iCounter-1;
            }

        }
        taskList[index] = newText;
        // newInput.addEventListener ("keypress",function(e){

        //     if (e.keyCode == 13 && newInput.value){
        //         e.preventDefault();
        //         saveBtn.click();
        //     }
        // })
        
        localStorage.setItem("taskList", taskList);
        newLi.innerHTML = '<span class="tick notDone"><i class="fa-solid fa-check"></i></span>' + newText +
    
        '<button id="deleteBtn"><i class="fa-solid fa-trash"></i></button><button id="editBtn"><i class="fa-solid fa-pen-to-square"></i></button>'
        
        showReport();
    }
})

clearAll.addEventListener("click", ()=>{
    
    function removeAllTasks(todoList) {
        while (todoList.firstChild) {
            todoList.removeChild(todoList.firstChild);
            taskList = [];
            checkedTasks = [];
        }
        
        
    }
    function removeLocalStorage(){
        
        localStorage.removeItem("taskList");
        localStorage.removeItem("checkedTasks");
    }
    taskCounter = 0;
    taskDone = 0;
    taskNotDone = 0;
    showReport();
    removeAllTasks(todoList);
    removeLocalStorage();
    if (todoList.children){
        clearAll.classList.remove("active");
    }
})

function showReport(){
    const report = document.querySelector(".report");
    report . innerHTML = `<span class="taskToDo"> ${taskCounter} Plan(s) to do</span><br>
    <span class="taskNotDone"> ${taskNotDone} Plan(s) Not Done yet!</span><br>
    <span class="taskDone"> ${taskDone} Plan(s) Done!</span>`
}

function saveTasks(userData){
    
    taskList.push(userData);
    localStorage.setItem("taskList" , taskList);
    localStorage.setItem("checkedTasks", checkedTasks);
}

function getTaskList(){
    return localStorage.getItem("taskList").split(",");
}
function getCheckedTasks(){
    return localStorage.getItem("checkedTasks").split(",");
}

function showTasks(){
    for (let taskText of getTaskList()) {
        
        taskCounter +=1;
        taskNotDone +=1;
        var task = createTask(taskText);
        task.innerHTML = '<span class="tick notDone"><i class="fa-solid fa-check"></i></span>' + taskText +
        '<button id="deleteBtn"><i class="fa-solid fa-trash"></i></button><button id="editBtn"><i class="fa-solid fa-pen-to-square"></i></button>'
        todoList.appendChild(task);
        task.classList.add("task");
        for (let checkedText of getCheckedTasks()) {
            
            if (taskText === checkedText){
                
                task.classList.add("checked");
                task.firstElementChild.classList.toggle("notDone");
                taskDone +=1;
                taskNotDone = taskCounter - taskDone;
            }
        }
        
    }
    if (taskList.length > 0){
        clearAll.classList.add("active");
    }
    
    showReport();
}