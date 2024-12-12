// Inicialização do Firebase Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCrZgHlPVX59zM68ENmAyXogc3JmoTU5rE",
    authDomain: "tentando-eed5d.firebaseapp.com",
    projectId: "tentando-eed5d",
    storageBucket: "tentando-eed5d.appspot.com",
    messagingSenderId: "103578231381",
    appId: "1:103578231381:web:485a8e94f53e8087e92adc",
    measurementId: "G-V3BFLM3V3X",
  };

// Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksCollection = collection(db, "todolist");

// Função para adicionar uma nova tarefa
async function addTask() {
    const taskInput = document.getElementById("taskInput");
    const prioritySelect = document.getElementById("prioritySelect");

    // Cria uma nova tarefa no Firestore
    const newTaskData = {
        text: taskInput.value,
        priority: prioritySelect.value,
        completed: false,
    };
    const docRef = await addDoc(tasksCollection, newTaskData);

    // Adiciona a nova tarefa no DOM
    renderTask({ id: docRef.id, ...newTaskData });

    taskInput.value = ""; // Limpa o campo de entrada
}

// Função para renderizar uma tarefa no DOM
function renderTask(task) {
    const tasks = document.getElementById("tasks");

    const newTask = document.createElement("div");
    newTask.className = "task priority-" + task.priority;
    newTask.dataset.id = task.id;

    newTask.innerHTML = `
        <span class="task-text">${task.text}</span>
        <div class="task-buttons">
            <button class="edit">✎ Editar</button>
            <button class="cancel">✘ Cancelar</button>
            <button class="confirm">✔ Confirmar</button>
        </div>
    `;
    tasks.appendChild(newTask);
}

// Função para carregar as tarefas do Firestore
async function loadTasks() {
    const snapshot = await getDocs(tasksCollection);
    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    tasks.forEach(renderTask); // Renderiza cada tarefa
}

// Adiciona listeners de eventos para o container de tarefas
document.getElementById("tasks").addEventListener("click", async function (event) {
    const button = event.target;
    if (button.tagName !== "BUTTON") return;

    const taskElement = button.closest(".task");
    const taskId = taskElement.dataset.id;

    // Botão Editar
    if (button.classList.contains("edit")) {
        const taskText = taskElement.querySelector(".task-text");
        const input = document.createElement("input");
        input.type = "text";
        input.value = taskText.textContent;

        taskText.replaceWith(input);
        input.focus();

        input.addEventListener("blur", () => saveEdit(taskId, input));
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") saveEdit(taskId, input);
        });
    }

    // Botão Cancelar
    if (button.classList.contains("cancel")) {
        await deleteDoc(doc(tasksCollection, taskId));
        taskElement.remove();
    }

    // Botão Confirmar
    if (button.classList.contains("confirm")) {
        await updateDoc(doc(tasksCollection, taskId), { completed: true });

        const taskText = taskElement.querySelector(".task-text");
        taskText.style.textDecoration = "line-through";
        taskText.style.color = "#888";
    }
});

// Função para salvar a edição da tarefa
async function saveEdit(taskId, input) {
    const updatedText = input.value;

    // Atualiza a tarefa no Firestore
    await updateDoc(doc(tasksCollection, taskId), { text: updatedText });

    const newText = document.createElement("span");
    newText.className = "task-text";
    newText.textContent = updatedText;

    input.replaceWith(newText);
}

// Carrega as tarefas quando a página é carregada
document.addEventListener("DOMContentLoaded", loadTasks);

// Deixa a função addTask global
window.addTask = addTask;
