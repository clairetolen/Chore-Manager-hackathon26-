let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const addButton = document.getElementById("addButton");
const todoList = document.getElementById("todoList");
addButton.addEventListener("click", addChore);

todoInput.addEventListener("keydown", function (event){
if (event.key=== "Enter"){
    event.preventDefault();
    addChore();
    }
});
displayChores();

function addChore(){
    const newChore = todoInput.value.trim();
    console.log("New chore:", newChore);
    if (newChore!==""){
        todo.push({
            text: newChore, 
            disabled: false,
        });
        saveToLocalStorage();
        todoInput.value = "";
        displayChores();
    }
}
function displayChores() {
   todoList.innerHTML = "";
   todo.forEach(function(item){
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = item.text;
    todoList.appendChild(li);
   });
}
function saveToLocalStorage(){
    localStorage.setItem("todo", JSON.stringify(todo));
}