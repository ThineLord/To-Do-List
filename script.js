document.addEventListener('DOMContentLoaded', () => {
    const taskCategorySelect = document.getElementById('task-category');
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date');
    const remarksInput = document.getElementById('remarks');
    const addTaskBtn = document.getElementById('add-task-btn');

    const learningTasksList = document.querySelector('#learning-tasks .task-list');
    const workTasksList = document.querySelector('#work-tasks .task-list');
    const lifeTasksList = document.querySelector('#life-tasks .task-list');

    // 从 localStorage 加载任务
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);

    function addTask() {
        const category = taskCategorySelect.value;
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const remarks = remarksInput.value.trim();
        const creationDate = new Date(); // 获取当前时间作为创建时间

        if (taskText === '') {
            alert('任务内容不能为空！');
            return;
        }

        const task = {
            id: Date.now().toString(), // 使用时间戳作为唯一ID
            text: taskText,
            category: category,
            creationDate: creationDate.toISOString(), // 存储为 ISO 格式字符串
            dueDate: dueDate,
            remarks: remarks,
            completed: false // 可以后续扩展完成状态
        };

        saveTask(task);
        renderTask(task);

        // 清空输入框
        taskInput.value = '';
        dueDateInput.value = '';
        remarksInput.value = '';
        taskCategorySelect.value = 'learning'; // 重置为默认分类
    }

    function renderTask(task) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.classList.add(`${task.category}-border`); // 添加分类边框颜色
        taskItem.dataset.id = task.id; // 设置 data-id 属性，方便删除

        const creationDateObj = new Date(task.creationDate);
        const formattedCreationDate = `${creationDateObj.toLocaleDateString()} ${creationDateObj.toLocaleTimeString()}`;

        let formattedDueDate = '无截止日期';
        if (task.dueDate) {
            const dueDateObj = new Date(task.dueDate);
            formattedDueDate = `${dueDateObj.toLocaleDateString()} ${dueDateObj.toLocaleTimeString()}`;
        }

        taskItem.innerHTML = `
            <h3>${task.text}</h3>
            <div class="task-meta">
                <p><strong>创建时间:</strong> ${formattedCreationDate}</p>
                <p><strong>截止时间:</strong> ${formattedDueDate}</p>
            </div>
            ${task.remarks ? `<div class="remarks-text"><p><strong>备注:</strong></p>${task.remarks.replace(/\n/g, '<br>')}</div>` : ''}
            <button class="delete-btn">删除</button>
        `;

        // 添加删除按钮的事件监听
        const deleteBtn = taskItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id, task.category);
            taskItem.remove(); // 从 DOM 中移除元素
        });

        // 根据分类将任务添加到对应的列表中
        if (task.category === 'learning') {
            learningTasksList.appendChild(taskItem);
        } else if (task.category === 'work') {
            workTasksList.appendChild(taskItem);
        } else if (task.category === 'life') {
            lifeTasksList.appendChild(taskItem);
        }
    }

    function saveTask(task) {
        let tasks = getTasksFromStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        let tasks = getTasksFromStorage();
        tasks.forEach(task => renderTask(task));
    }

    function getTasksFromStorage() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function deleteTask(taskId, category) {
        let tasks = getTasksFromStorage();
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // 可选：如果需要严格从对应的 DOM 列表中删除，可以这样做，
        // 但上面的 taskItem.remove() 已经处理了视觉上的删除。
        // const listElement = document.querySelector(`#${category}-tasks .task-list`);
        // const itemToRemove = listElement.querySelector(`[data-id='${taskId}']`);
        // if (itemToRemove) {
        //     listElement.removeChild(itemToRemove);
        // }
    }
});