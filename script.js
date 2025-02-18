let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentEditId = null;

// Initialize app
function init() {
    renderTasks();
    setupEventListeners();
    updateTaskCounter();
}

function setupEventListeners() {
    document.getElementById('addTaskForm')?.addEventListener('submit', addTask);
    document.getElementById('editTaskForm')?.addEventListener('submit', updateTask);
    document.getElementById('clearStorage')?.addEventListener('click', clearStorage);
}

function addTask(e) {
    e.preventDefault();
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const taskTime = document.getElementById('taskTime');

    if (taskInput.value.trim() && taskDate.value && taskTime.value) {
        const newTask = {
            id: Date.now(),
            text: taskInput.value.trim(),
            date: taskDate.value,
            time: taskTime.value,
            completed: false
        };

        tasks.push(newTask);
        saveAndRender();
        e.target.reset();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

function toggleComplete(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveAndRender();
}

function openEditModal(id) {
    currentEditId = id;
    const task = tasks.find(task => task.id === id);
    document.getElementById('editTaskInput').value = task.text;
    document.getElementById('editTaskDate').value = task.date;
    document.getElementById('editTaskTime').value = task.time;
    new bootstrap.Modal(document.getElementById('editTaskModal')).show();
}

function updateTask(e) {
    e.preventDefault();
    tasks = tasks.map(task => {
        if (task.id === currentEditId) {
            return {
                ...task,
                text: document.getElementById('editTaskInput').value.trim(),
                date: document.getElementById('editTaskDate').value,
                time: document.getElementById('editTaskTime').value
            };
        }
        return task;
    });
    saveAndRender();
    bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    updateTaskCounter();
}

function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-card ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <div class="flex-grow-1">
                <h5 class="mb-2">${task.text}</h5>
                <div class="datetime-group">
                    <span class="text-muted">
                        <i class="bi bi-calendar"></i> ${task.date}
                    </span>
                    <span class="text-muted ms-3">
                        <i class="bi bi-clock"></i> ${task.time}
                    </span>
                </div>
            </div>
            <div class="task-actions">
                <span class="status-badge badge ${task.completed ? 'bg-success' : 'bg-warning'}">
                    ${task.completed ? 'Completed' : 'Pending'}
                </span>
                <button class="btn btn-sm ${task.completed ? 'btn-secondary' : 'btn-success'}" 
                        onclick="toggleComplete(${task.id})">
                    <i class="bi ${task.completed ? 'bi-arrow-counterclockwise' : 'bi-check2'}"></i>
                </button>
                <button class="btn btn-sm btn-primary" 
                        onclick="openEditModal(${task.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" 
                        onclick="deleteTask(${task.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        tasksList.appendChild(taskElement);
    });
}

function updateTaskCounter() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
}

function clearStorage() {
    localStorage.clear();
    tasks = [];
    saveAndRender();
}

// Initialize app
document.addEventListener('DOMContentLoaded', init);