import { createModal, setupModalEvents } from './modal.js';
import { createEditModal, setupEditModalEvents } from './editModal.js';

document.addEventListener('DOMContentLoaded', () => {
  createModal();
  createEditModal(); 
  const addButton = document.getElementById('addButton');
  const taskContainer = document.getElementById('taskContainer');
  
  if (!addButton) {
    console.error('Кнопку з id "addButton" не знайдено!');
    return;
  }

  const categoryColors = {
    'Робота': '#92cbff',
    'Особисте': '#fda859',
    'Покупки': '#6bf380',
    'Здоров\'я': '#fa8ab3'
  };

  const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach((task) => addTaskToDOM(task));
  };

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

  const addTaskToDOM = ({ text, time, completed, category }) => {
    const task = document.createElement('div');
    task.className = 'home-tasks__item';
    const uniqueId = 'checkbox_' + Date.now() + Math.random().toString(36).substring(2); 
    
    const categoryColor = categoryColors[category] || '#79a7d8';
    
    task.style.setProperty('--category-border-color', categoryColor);

    const dynamicStyle = document.createElement('style');
    dynamicStyle.textContent = `
      #${uniqueId} + .my-label {
        border-color: ${categoryColor};
      }
      #${uniqueId} + .my-label::after {
        background-color: ${categoryColor};
      }
      #${uniqueId}:checked + .my-label::after {
        transform: translate(-50%, -50%) scale(1);
      }
    `;
    task.appendChild(dynamicStyle);

    task.setAttribute('tabindex', '0');

    task.innerHTML += `
      <div class="home-tasks__func">
        <div class="custom-radio">
          <input type="checkbox" id="${uniqueId}" ${completed ? 'checked' : ''} />
          <label class="my-label" for="${uniqueId}"></label>
        </div>
        <p class="home-tasks__text ${completed ? 'completed' : ''}">${text}</p>
      </div>
      <span class="home-tasks__category" data-category="${category}" style="background-color: ${categoryColor}; color: white; padding: 2px 6px; border-radius: 4px;">${category}</span>
      <span class="home-tasks__time ${completed ? 'completed' : ''}">
        <span class="material-icons-outlined delete-task">delete</span>${time}
      </span>
    `;
    taskContainer.appendChild(task);

   
    setupEditModalEvents(task, (updatedTask) => {
      const taskText = task.querySelector('.home-tasks__text');
      const taskTime = task.querySelector('.home-tasks__time');
      const taskCategory = task.querySelector('.home-tasks__category');
      
      taskText.textContent = updatedTask.text;
     
      const deleteIcon = taskTime.querySelector('.delete-task');
      taskTime.textContent = updatedTask.time;
      taskTime.insertBefore(deleteIcon, taskTime.firstChild);
      
  
      taskCategory.textContent = updatedTask.category;
      taskCategory.style.backgroundColor = categoryColors[updatedTask.category] || '#79a7d8';
      
      saveTasks();
    });

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

  const categoryButtons = document.querySelectorAll('.home-category__item');
  categoryButtons.forEach(button => {
    const categoryName = button.querySelector('.home-category__describe').textContent.trim();
    const categoryColor = categoryColors[categoryName] || '#79a7d8';

    button.style.setProperty('--category-border-color', categoryColor);

    button.addEventListener('click', () => {
      const selectedCategory = categoryName;
      filterTasksByCategory(selectedCategory);
    });
  });

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
    if (
      e.target.closest('.home-category__item') || 
      e.target.closest('.home-tasks__item') ||   
      e.target.closest('input[type="checkbox"]') 
    ) {
      return; 
    }
    filterTasksByCategory('all');
  });
});
document.addEventListener('DOMContentLoaded', () => {

  const navList = document.getElementById('navList');
  const menuButton = document.querySelector('.home-page__menu');
  const closeButton = document.getElementById('closeButton');
  const overlay = document.getElementById('overlay');
  const body = document.body;

  
  menuButton?.addEventListener('click', toggleMenu);


  closeButton?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', toggleMenu);

  function toggleMenu() {
    const isActive = navList.classList.toggle('active');
    overlay.classList.toggle('active');
    body.classList.toggle('no-scroll', isActive);
  }
});