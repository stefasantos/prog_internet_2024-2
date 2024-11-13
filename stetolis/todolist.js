function addTask() {
    const taskInput = document.getElementById("taskInput");
    const prioritySelect = document.getElementById("prioritySelect");
    const tasks = document.getElementById("tasks");

    if (taskInput.value.trim() === "") {
        alert("Por favor, insira uma atividade.");
        return;
    }

    // Cria novo elemento de tarefa
    const newTask = document.createElement("div");
    newTask.className = "task priority-" + prioritySelect.value;

    // Conteúdo da tarefa com um span para o texto e os botões de ação
    newTask.innerHTML = `
        <span class="task-text">${taskInput.value}</span>
        <div class="task-buttons">
            <button onclick="editTask(this)">✏️ Editar</button>
            <button onclick="cancelTask(this)">❌ Cancelar</button>
            <button onclick="confirmTask(this)">✔️ Confirmar</button>
        </div>
    `;

    tasks.appendChild(newTask);

    taskInput.value = "";
}

function editTask(button) {
    const task = button.parentElement.parentElement;
    const taskText = task.querySelector(".task-text");

    const input = document.createElement("input");
    input.type = "text";
    input.value = taskText.textContent;
    input.className = "edit-input";

    task.replaceChild(input, taskText);

    input.focus();

    input.addEventListener("blur", () => saveEdit(input, task));
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            saveEdit(input, task);
        }
    });
}

function saveEdit(input, task) {
    const newTaskText = document.createElement("span");
    newTaskText.className = "task-text";
    newTaskText.textContent = input.value;

    task.replaceChild(newTaskText, input);
}

function cancelTask(button) {
    const task = button.parentElement.parentElement;
    task.remove();
}

function confirmTask(button) {
    const task = button.parentElement.parentElement;
    task.style.textDecoration = "line-through"; 
    task.style.color = "#888";
}

