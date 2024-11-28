// Importa os módulos necessários do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Configuração do Firebase com as credenciais do projeto
const firebaseConfig = {
    apiKey: "AIzaSyBapHl3pGdVdVwYaHnMZ_SSrbQ9LMl2kP8", // Chave de API para autenticação
    authDomain: "todolist-a644e.firebaseapp.com", // Domínio autenticado do projeto
    databaseURL: "https://todolist-a644e-default-rtdb.firebaseio.com/", // URL do banco de dados em tempo real
    projectId: "todolist-a644e", // ID do projeto no Firebase
    storageBucket: "todolist-a644e.appspot.com", // Local de armazenamento de arquivos
    messagingSenderId: "1077970111182", // ID para mensagens push
    appId: "1:1077970111182:web:8b7a19093248ed48e85e9f", // Identificador da aplicação
    measurementId: "G-2P3HDGFR4N", // ID para análise (Analytics)
};

// Inicializa o Firebase com as configurações fornecidas e conecta o banco de dados
const app = initializeApp(firebaseConfig); // Inicializa o app Firebase
const db = getDatabase(app); // Obtém uma instância do banco de dados em tempo real

// Função para adicionar uma nova tarefa ao banco de dados e à interface
function addTask() {
    const taskInput = document.getElementById("taskInput"); // Captura o campo de texto onde o usuário insere a tarefa
    const prioritySelect = document.getElementById("prioritySelect"); // Captura o seletor de prioridade (alta, média, baixa)

    if (taskInput.value.trim() === "") { // Verifica se o campo de entrada está vazio
        alert("Por favor, insira uma tarefa."); // Exibe uma mensagem de alerta se a entrada for inválida
        return; // Encerra a execução da função para evitar adicionar tarefas inválidas
    }

    // Cria um objeto representando a nova tarefa
    const taskData = {
        text: taskInput.value, // Texto da tarefa inserida pelo usuário
        priority: prioritySelect.value, // Prioridade selecionada pelo usuário
        completed: false, // Indica que a tarefa ainda não foi concluída
    };

    // Define a referência ao nó "tasks" no banco de dados Firebase
    const tasksRef = ref(db, "tasks"); // Aponta para o caminho "tasks" no banco de dados em tempo real

    // Adiciona a nova tarefa ao banco de dados, criando um nó único para ela
    push(tasksRef, taskData);

    // Limpa o campo de entrada de texto após adicionar a tarefa
    taskInput.value = "";
}

// Função para carregar as tarefas do banco de dados e exibi-las na interface
function loadTasks() {
    const tasksRef = ref(db, "tasks"); // Define a referência ao nó "tasks" no banco de dados

    // Ouve as alterações no banco de dados em tempo real
    onValue(tasksRef, (snapshot) => {
        const tasks = document.getElementById("tasks"); // Captura o contêiner onde as tarefas serão exibidas
        tasks.innerHTML = ""; // Limpa o conteúdo atual para evitar duplicações

        snapshot.forEach((childSnapshot) => { // Itera sobre cada tarefa retornada pelo banco de dados
            const task = childSnapshot.val(); // Obtém os dados da tarefa
            const taskElement = document.createElement("div"); // Cria um elemento de div para exibir a tarefa
            taskElement.className = "task priority-" + task.priority; // Adiciona a classe correspondente à prioridade

            // Define o conteúdo HTML da tarefa
            taskElement.innerHTML = `
                <span class="task-text">${task.text}</span> <!-- Texto da tarefa -->
                <div class="task-buttons"> <!-- Botões de ação -->
                    <button class="edit">✎ Editar</button> <!-- Botão para editar a tarefa -->
                    <button class="cancel">✘ Cancelar</button> <!-- Botão para remover a tarefa -->
                    <button class="confirm">✔ Confirmar</button> <!-- Botão para marcar como concluída -->
                </div>
            `;

            tasks.appendChild(taskElement); // Adiciona o elemento da tarefa à lista na interface
        });
    });
}

// Chama a função para carregar as tarefas ao inicializar a página
loadTasks();

// Adiciona um listener de eventos para gerenciar ações nos botões de cada tarefa
document.getElementById("tasks").addEventListener("click", function (event) {
    const button = event.target; // Obtém o elemento que foi clicado

    if (button.tagName !== "BUTTON") return; // Ignora cliques que não sejam em botões

    if (button.classList.contains("edit")) { // Se o botão clicado for "Editar"
        const taskText = button.closest(".task").querySelector(".task-text"); // Obtém o texto da tarefa
        const input = document.createElement("input"); // Cria um campo de entrada para edição
        input.type = "text"; // Define o tipo do campo como texto
        input.value = taskText.textContent; // Preenche o campo de entrada com o texto atual da tarefa

        taskText.replaceWith(input); // Substitui o texto atual pelo campo de entrada
        input.focus(); // Foca no campo de entrada para facilitar a edição

        input.addEventListener("blur", () => saveEdit(input)); // Salva a edição ao perder o foco
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") saveEdit(input); // Salva a edição ao pressionar Enter
        });
    }

    if (button.classList.contains("cancel")) { // Se o botão clicado for "Cancelar"
        button.closest(".task").remove(); // Remove a tarefa da interface
    }

    if (button.classList.contains("confirm")) { // Se o botão clicado for "Confirmar"
        const taskText = button.closest(".task").querySelector(".task-text"); // Obtém o texto da tarefa
        taskText.style.textDecoration = "line-through"; // Risca o texto para indicar que foi concluído
        taskText.style.color = "#888"; // Muda a cor do texto para cinza
    }
});

// Função para salvar a edição de uma tarefa
function saveEdit(input) {
    const newText = document.createElement("span"); // Cria um novo elemento de texto (span)
    newText.className = "task-text"; // Define a classe do elemento
    newText.textContent = input.value; // Define o texto como o valor do campo de entrada

    input.replaceWith(newText); // Substitui o campo de entrada pelo texto atualizado
}
