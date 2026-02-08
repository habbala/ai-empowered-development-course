import { VibeKanbanWebCompanion } from 'vibe-kanban-web-companion';
import { format, compareAsc, isPast, isToday, isTomorrow } from 'date-fns';

// Todos array (Feature 1)
let todos = [];
let nextId = 1;

// Current filter (Feature 2)
let currentFilter = 'all';

// Current sort option (Feature 3)
let currentSort = 'none';

// LocalStorage functions
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('nextId', JSON.stringify(nextId));
}

function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    const savedNextId = localStorage.getItem('nextId');

    if (savedTodos) {
        try {
            todos = JSON.parse(savedTodos);
        } catch (e) {
            console.warn('Failed to parse saved todos', e);
            todos = [];
        }
    }

    if (savedNextId) {
        try {
            nextId = JSON.parse(savedNextId);
        } catch (e) {
            console.warn('Failed to parse saved nextId', e);
            nextId = 1;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    initVibeKanban();
});

function init() {
    // Load persisted todos from localStorage
    loadTodos();

    // Wire up add button
    const addBtn = document.getElementById('addBtn');
    const todoInput = document.getElementById('todoInput');
    const dueDateInput = document.getElementById('dueDateInput');

    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    // Wire up filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    // Wire up sort button
    const sortBtn = document.getElementById('sortBtn');
    if (sortBtn) {
        sortBtn.addEventListener('click', toggleSort);
    }

    renderTodos();
}

function initVibeKanban() {
    const companion = new VibeKanbanWebCompanion();
    companion.render(document.body);
}

// Feature 1: Add, toggle, delete todos
function addTodo() {
    const input = document.getElementById('todoInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const text = input.value.trim();

    if (text === '') return;

    const dueDate = dueDateInput.value ? new Date(dueDateInput.value) : null;

    todos.push({
        id: nextId++,
        text: text,
        completed: false,
        dueDate: dueDate ? dueDate.toISOString() : null
    });

    input.value = '';
    dueDateInput.value = '';
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

// Feature 1: Render todos
function renderTodos() {
    const todoList = document.getElementById('todoList');
    let filteredTodos = getFilteredTodos();

    // Apply sorting if enabled
    if (currentSort === 'dueDate') {
        filteredTodos = sortByDueDate(filteredTodos);
    }

    todoList.innerHTML = '';

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (todo.completed) li.classList.add('completed');

        const dueDateHtml = todo.dueDate ? formatDueDate(todo.dueDate) : '';

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <div class="todo-content">
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                ${dueDateHtml}
            </div>
            <button class="todo-delete">Delete</button>
        `;

        li.querySelector('.todo-checkbox').addEventListener('change', () => toggleTodo(todo.id));
        li.querySelector('.todo-delete').addEventListener('click', () => deleteTodo(todo.id));

        todoList.appendChild(li);
    });
}

// Feature 2: Filter todos based on current filter
function getFilteredTodos() {
    if (currentFilter === 'active') {
        return todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        return todos.filter(t => t.completed);
    }
    return todos; // 'all'
}

// Feature 2: Set filter and update UI
function setFilter(filter) {
    currentFilter = filter;

    // Update button styling
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });

    renderTodos();
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Feature 3: Format due date with status indicators
function formatDueDate(dueDateString) {
    if (!dueDateString) return '';

    const dueDate = new Date(dueDateString);
    const now = new Date();

    let statusClass = '';
    let statusText = '';

    if (isPast(dueDate) && !isToday(dueDate)) {
        statusClass = 'overdue';
        statusText = format(dueDate, 'MMM d, yyyy') + ' (Overdue)';
    } else if (isToday(dueDate)) {
        statusClass = 'due-today';
        statusText = 'Due today';
    } else if (isTomorrow(dueDate)) {
        statusClass = 'due-soon';
        statusText = 'Due tomorrow';
    } else {
        statusClass = 'due-upcoming';
        statusText = format(dueDate, 'MMM d, yyyy');
    }

    return `<span class="todo-due-date ${statusClass}">${escapeHtml(statusText)}</span>`;
}

// Feature 3: Sort todos by due date (upcoming first, no due date last)
function sortByDueDate(todosToSort) {
    return todosToSort.sort((a, b) => {
        // No due date goes to the end
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        // Sort by due date in ascending order (upcoming first)
        return compareAsc(new Date(a.dueDate), new Date(b.dueDate));
    });
}

// Feature 3: Toggle sort by due date
function toggleSort() {
    if (currentSort === 'dueDate') {
        currentSort = 'none';
    } else {
        currentSort = 'dueDate';
    }

    // Update button styling
    const sortBtn = document.getElementById('sortBtn');
    if (sortBtn) {
        sortBtn.classList.toggle('active', currentSort === 'dueDate');
    }

    renderTodos();
}
