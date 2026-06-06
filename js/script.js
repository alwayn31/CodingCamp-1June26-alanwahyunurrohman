document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. GREETING & DATETIME + CUSTOM NAME
    // ==========================================
    const greetingText = document.getElementById('greeting-text');
    const currentDatetime = document.getElementById('current-datetime');
    const nameDisplay = document.getElementById('name-display');
    const nameInput = document.getElementById('name-input');

    function updateGreeting() {
        const now = new Date();
        const hours = now.getHours();
        let greeting = "Good Night";

        if (hours >= 5 && hours < 12) greeting = "Good Morning";
        else if (hours >= 12 && hours < 17) greeting = "Good Afternoon";
        else if (hours >= 17 && hours < 22) greeting = "Good Evening";

        greetingText.textContent = greeting;
        currentDatetime.textContent = now.toLocaleString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit' 
        });
    }
    setInterval(updateGreeting, 1000);
    updateGreeting();

    // Challenge: Custom Name
    const savedName = localStorage.getItem('customName') || "Click to set name";
    nameDisplay.textContent = savedName;

    nameDisplay.addEventListener('click', () => {
        nameDisplay.classList.add('hidden');
        nameInput.classList.remove('hidden');
        nameInput.value = savedName === "Click to set name" ? "" : savedName;
        nameInput.focus();
    });

    nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const newName = nameInput.value.trim() || "Click to set name";
            localStorage.setItem('customName', newName);
            nameDisplay.textContent = newName;
            nameDisplay.classList.remove('hidden');
            nameInput.classList.add('hidden');
        }
    });

    // ==========================================
    // 2. FOCUS TIMER (POMODORO 25 MIN)
    // ==========================================
    let timerInterval;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    const timerDisplay = document.getElementById('timer-display');
    const timerStart = document.getElementById('timer-start');
    const timerStop = document.getElementById('timer-stop');
    const timerReset = document.getElementById('timer-reset');

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
    }

    timerStart.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                alert("Time's up! Take a break.");
            }
        }, 1000);
    });

    timerStop.addEventListener('click', () => clearInterval(timerInterval));
    timerReset.addEventListener('click', () => {
        clearInterval(timerInterval);
        timeLeft = 25 * 60;
        updateTimerDisplay();
    });

    // ==========================================
    // 3. TO-DO LIST (+ PREVENT DUPLICATE CHALLENGE)
    // ==========================================
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const todoError = document.getElementById('todo-error');
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.done ? 'done' : ''}`;
            li.innerHTML = `
                <span>${todo.text}</span>
                <div class="todo-actions">
                    <button class="btn btn-success btn-sm" onclick="toggleTodo(${index})">✓</button>
                    <button class="btn btn-warning btn-sm" onclick="editTodo(${index})">✎</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTodo(${index})">✗</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    }

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = todoInput.value.trim();

        // Challenge: Prevent Duplicate
        const isDuplicate = todos.some(todo => todo.text.toLowerCase() === taskText.toLowerCase());
        if (isDuplicate) {
            todoError.classList.remove('hidden');
            return;
        }
        todoError.classList.add('hidden');

        todos.push({ text: taskText, done: false });
        todoInput.value = '';
        saveTodos();
    });

    window.toggleTodo = (index) => { todos[index].done = !todos[index].done; saveTodos(); };
    window.deleteTodo = (index) => { todos.splice(index, 1); saveTodos(); };
    window.editTodo = (index) => {
        const newText = prompt("Edit your task:", todos[index].text);
        if (newText && newText.trim() !== "") {
            todos[index].text = newText.trim();
            saveTodos();
        }
    };
    renderTodos();

    // ==========================================
    // 4. QUICK LINKS
    // ==========================================
    const linksForm = document.getElementById('links-form');
    const linkName = document.getElementById('link-name');
    const linkUrl = document.getElementById('link-url');
    const linksContainer = document.getElementById('links-container');
    let links = JSON.parse(localStorage.getItem('quickLinks')) || [];

    function saveLinks() {
        localStorage.setItem('quickLinks', JSON.stringify(links));
        renderLinks();
    }

    function renderLinks() {
        linksContainer.innerHTML = '';
        links.forEach((link, index) => {
            const div = document.createElement('div');
            div.className = 'link-shortcut';
            div.innerHTML = `
                <a href="${link.url}" target="_blank">${link.name}</a>
                <span class="delete-link" onclick="deleteLink(${index})">×</span>
            `;
            linksContainer.appendChild(div);
        });
    }

    linksForm.addEventListener('submit', (e) => {
        e.preventDefault();
        links.push({ name: linkName.value.trim(), url: linkUrl.value.trim() });
        linkName.value = '';
        linkUrl.value = '';
        saveLinks();
    });

    window.deleteLink = (index) => { links.splice(index, 1); saveLinks(); };
    renderLinks();

    // ==========================================
    // 5. LIGHT / DARK MODE CHALLENGE
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = "Toggle Light Mode";
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = "Toggle Dark Mode";
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = "Toggle Light Mode";
        }
    });
});