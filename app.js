/**
 * State-Driven Task Manager
 * Author: Gauri Gundawar
 */

// STATE MANAGEMENT
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filtersContainer = document.querySelector('.filters');

// HELPER: Save to LocalStorage
const saveTasks = () => localStorage.setItem('todos', JSON.stringify(todos));

// 1. READ & RENDER
const renderTodos = () => {
    todoList.innerHTML = ''; 

    // Apply active filter
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true; 
    });

    // Empty state message
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `<li class="empty-state">No tasks here yet.</li>`;
        return;
    }

    // Generate List Items
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;
        
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="task-text">${todo.text}</span>
            </div>
            <div class="task-actions">
                <button class="btn-icon edit-btn" title="Edit Task">✏️</button>
                <button class="btn-icon delete-btn" title="Delete Task">🗑️</button>
            </div>
        `;
        todoList.appendChild(li);
    });
};

// 2. CREATE
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    if (!taskText) return;
    
    todos.push({ 
        id: Date.now().toString(), 
        text: taskText, 
        completed: false 
    });
    
    saveTasks();
    renderTodos();
    todoInput.value = ''; 
});

// 3. UPDATE & DELETE
todoList.addEventListener('click', (e) => {
    const item = e.target.closest('.todo-item');
    if (!item) return;
    const taskId = item.dataset.id;

    // Toggle Complete
    if (e.target.classList.contains('task-checkbox')) {
        todos = todos.map(todo => todo.id === taskId ? { ...todo, completed: e.target.checked } : todo);
        saveTasks();
        renderTodos();
    }

    // Edit Text
    if (e.target.closest('.edit-btn')) {
        const currentText = item.querySelector('.task-text').innerText;
        const newText = prompt('Update your task:', currentText);
        if (newText !== null && newText.trim() !== '') {
            todos = todos.map(todo => todo.id === taskId ? { ...todo, text: newText.trim() } : todo);
            saveTasks();
            renderTodos();
        }
    }

    // Delete Item
    if (e.target.closest('.delete-btn')) {
        todos = todos.filter(todo => todo.id !== taskId);
        saveTasks();
        renderTodos();
    }
});

// 4. FILTERING
filtersContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = e.target.dataset.filter;
    renderTodos();
});

// Initial Load
renderTodos();