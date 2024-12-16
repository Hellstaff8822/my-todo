import { createModal, setupModalEvents } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
  createModal();
  const addButton = document.getElementById('addButton');
  const taskContainer = document.getElementById('taskContainer');
  
  if (!addButton) {
    console.error('Button with id "addButton" not found!');
    return;
  }

  // Завантаження тасків з localStorage
  const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach((task) => addTaskToDOM(task));
  };

  // Збереження тасків в localStorage
  const saveTasks = () => {
    const tasks = [];
    document.querySelectorAll('.home-tasks__item').forEach((taskElement) => {
      const text = taskElement.querySelector('.home-tasks__text').textContent;
      const time = taskElement.querySelector('.home-tasks__time').textContent;
      const completed = taskElement.querySelector('input[type="checkbox"]').checked;
      const category = taskElement.querySelector('.home-tasks__category').textContent;
      tasks.push({ text, time, completed, category });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Додавання таска в DOM
  const addTaskToDOM = ({ text, time, completed, category }) => {
    const task = document.createElement('div');
    task.className = 'home-tasks__item';
    const uniqueId = 'checkbox_' + Date.now() + Math.random().toString(36).substring(2); 
    task.innerHTML = `
      <div class="home-tasks__func">
        <div class="custom-radio">
          <input type="checkbox" id="${uniqueId}" ${completed ? 'checked' : ''} />
          <label class="my-label" for="${uniqueId}"></label>
        </div>
        <p class="home-tasks__text ${completed ? 'completed' : ''}">${text}</p>
      </div>
      <span class="home-tasks__category">${category}</span>
      <span class="home-tasks__time ${completed ? 'completed' : ''}">
        <span class="material-icons-outlined delete-task">delete</span>${time}
      </span>
    `;
    taskContainer.appendChild(task);

    // Додати обробник для чекбокса
    const checkbox = task.querySelector('input[type="checkbox"]');
    const taskText = task.querySelector('.home-tasks__text');
    const taskTime = task.querySelector('.home-tasks__time');
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        taskText.classList.add('completed');
        taskTime.classList.add('completed');
      } else {
        taskText.classList.remove('completed');
        taskTime.classList.remove('completed');
      }
      saveTasks();
    });

    const deleteButton = task.querySelector('.delete-task');
    deleteButton.addEventListener('click', () => {
      task.remove();
      saveTasks();
    });
  };

  setupModalEvents('addButton', (taskData) => {
    addTaskToDOM({
      text: `${taskData.text}`,
      time: taskData.time,
      completed: false,
      category: taskData.category,
    });
    saveTasks();
  });

  loadTasks();


  const categoryButtons = document.querySelectorAll('.home-category__item');
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedCategory = button.querySelector('.home-category__describe').textContent.trim();
      filterTasksByCategory(selectedCategory);
    });
  });

  const filterTasksByCategory = (category) => {
    const tasks = document.querySelectorAll('.home-tasks__item');
    tasks.forEach(task => {
      const taskCategory = task.querySelector('.home-tasks__category').textContent.trim(); 
      if (taskCategory === category || category === 'all') {
        task.style.display = 'flex'; 
      } else {
        task.style.display = 'none'; 
      }
    });
  };

  filterTasksByCategory('all');

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.home-category__item')) {
      filterTasksByCategory('all');
    }
  });
});