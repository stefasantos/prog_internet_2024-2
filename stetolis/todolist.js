function addTask() {
    const taskInput = document.getElementById("taskInput");
    const prioritySelect = document.getElementById("prioritySelect");
    const tasks = document.getElementById("tasks");

    if (taskInput.value.trim() === "") {
        alert("Por favor, insira uma atividade.");
        return;
    }

    // Cria a nova tarefa
    const newTask = document.createElement("div");
    newTask.className = "task priority-" + prioritySelect.value;

    // Adiciona conteúdo da nova tarefa (texto e botões)
    newTask.innerHTML = `
        <span class="task-text">${taskInput.value}</span>
        <div class="task-buttons">
            <button class="edit">✎ Editar</button>
            <button class="cancel">✘ Cancelar</button>
            <button class="confirm">✔ Confirmar</button>
        </div>
    `;

    // Adiciona a nova tarefa ao contêiner
    tasks.appendChild(newTask);

    // Limpa o campo de entrada
    taskInput.value = "";
}

// Delegação de eventos para os botões
document.getElementById("tasks").addEventListener("click", function(event) {
    const button = event.target;

    // Verifica se o clique foi em um botão
    if (button.tagName !== "BUTTON") return;

    // Ação para o botão Editar
    if (button.classList.contains("edit")) {
        const taskText = button.closest(".task").querySelector(".task-text");
        const input = document.createElement("input");
        input.type = "text";
        input.value = taskText.textContent;

        // Substitui o texto pelo campo de input
        taskText.replaceWith(input);

        input.focus();

        // Salva a edição ao perder o foco ou ao pressionar Enter
        input.addEventListener("blur", () => saveEdit(input));
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") saveEdit(input);
        });
    }

    // Ação para o botão Cancelar
    if (button.classList.contains("cancel")) {
        button.closest(".task").remove(); // Remove a tarefa do DOM
    }

    // Ação para o botão Confirmar
    if (button.classList.contains("confirm")) {
        const taskText = button.closest(".task").querySelector(".task-text");
        taskText.style.textDecoration = "line-through";
        taskText.style.color = "#888"; // Marca a tarefa como concluída
    }
});

// Função para salvar a edição
function saveEdit(input) {
    const newText = document.createElement("span");
    newText.className = "task-text";
    newText.textContent = input.value;

    input.replaceWith(newText); // Substitui o input pelo novo texto
}
