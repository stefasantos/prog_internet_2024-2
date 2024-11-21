// Função para adicionar uma nova tarefa
function addTask() {
    // Obtém o valor do campo de entrada da tarefa
    const taskInput = document.getElementById("taskInput");
    // Obtém o valor da prioridade selecionada
    const prioritySelect = document.getElementById("prioritySelect");
    // Obtém o contêiner onde as tarefas serão exibidas
    const tasks = document.getElementById("tasks");

    // Cria um elemento de div para a nova tarefa
    const newTask = document.createElement("div");
    // Adiciona classes com base na prioridade selecionada
    newTask.className = "task priority-" + prioritySelect.value;

    // Define o conteúdo HTML da nova tarefa, incluindo o texto e botões
    newTask.innerHTML = `
        <span class="task-text">${taskInput.value}</span>
        <div class="task-buttons">
            <button class="edit">✎ Editar</button>
            <button class="cancel">✘ Cancelar</button>
            <button class="confirm">✔ Confirmar</button>
        </div>
    `;

    // Adiciona a nova tarefa ao contêiner de tarefas
    tasks.appendChild(newTask);

    // Limpa o campo de entrada após adicionar a tarefa
    taskInput.value = "";
}

// Adiciona um listener de eventos ao contêiner de tarefas para delegação
document.getElementById("tasks").addEventListener("click", function(event) {
    const button = event.target; // Identifica o elemento que foi clicado

    // Verifica se o elemento clicado é um botão
    if (button.tagName !== "BUTTON") return;

    // Ação para o botão Editar
    if (button.classList.contains("edit")) {
        const taskText = button.closest(".task").querySelector(".task-text"); // Obtém o texto da tarefa
        const input = document.createElement("input"); // Cria um campo de input
        input.type = "text";
        input.value = taskText.textContent; // Preenche o input com o texto atual da tarefa

        // Substitui o texto pelo campo de input
        taskText.replaceWith(input);

        input.focus(); // Coloca o foco no input

        // Salva a edição ao perder o foco ou pressionar Enter
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
        // Marca a tarefa como concluída, alterando o estilo
        taskText.style.textDecoration = "line-through";
        taskText.style.color = "#888";
    }
});

// Função para salvar a edição da tarefa
function saveEdit(input) {
    // Cria um elemento span para substituir o campo de input
    const newText = document.createElement("span");
    newText.className = "task-text";
    newText.textContent = input.value; // Define o texto como o valor do input

    // Substitui o input pelo novo texto
    input.replaceWith(newText);
}
