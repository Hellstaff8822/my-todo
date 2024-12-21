export function createEditModal() {
  const modal = document.createElement('div');
  modal.id = 'editTaskModal';
  modal.className = 'modal hidden';
  modal.innerHTML = `
      <div class="modal-content">
        <span class="material-icons-outlined close-btn" id="closeEditModal">close</span>

        <h2>Редагувати задачу</h2>
        <form id="editTaskForm">
          <label for="editTaskText">Задача:</label>
          <input type="text" id="editTaskText" placeholder="Введіть текст задачі" required />
          
          <label for="editTaskCategory">Категорія:</label>
          <select id="editTaskCategory">
            <option>Робота</option>
            <option>Особисте</option>
            <option>Покупки</option>
            <option>Здоров&#39;я</option>
          </select>
          
          <label for="editTaskTime">Час:</label>
          <input type="time" id="editTaskTime" required />
          
          <button class="save-button" type="submit">Зберегти</button>
        </form>
      </div>
    `;
  document.body.appendChild(modal);
}

export function setupEditModalEvents(taskElement, onSave) {
  let pressTimer;
  const modal = document.getElementById('editTaskModal');
  const closeModal = document.querySelector('.close-btn');
  const editForm = document.getElementById('editTaskForm');
  const taskTextInput = document.getElementById('editTaskText');
  const taskTimeInput = document.getElementById('editTaskTime');
  const taskCategoryInput = document.getElementById('editTaskCategory');

 
  const categoryColors = {
    'Робота': '#92cbff',
    'Особисте': '#fda859',
    'Покупки': '#6bf380',
    'Здоров\'я': '#fa8ab3'
  };

  let currentTaskElement = null;

  const startPress = (element) => {
    pressTimer = setTimeout(() => {
      currentTaskElement = element;
      const taskText = currentTaskElement.querySelector('.home-tasks__text').textContent;
      const taskTimeElement = currentTaskElement.querySelector('.home-tasks__time');
      const timeText = taskTimeElement.textContent.replace(/delete/, '').trim();
      const taskCategory = currentTaskElement.querySelector('.home-tasks__category').textContent;

      taskTextInput.value = taskText;
      taskTimeInput.value = timeText;
      taskCategoryInput.value = taskCategory;

      modal.classList.remove('hidden');
    }, 500);
  };

  const cancelPress = () => {
    clearTimeout(pressTimer);
  };

  const updateTaskColors = (taskElement, category) => {
    const categoryColor = categoryColors[category] || '#79a7d8';
    
   
    taskElement.style.setProperty('--category-border-color', categoryColor);
    
 
    const categorySpan = taskElement.querySelector('.home-tasks__category');
    categorySpan.style.backgroundColor = categoryColor;
    
 
    const checkbox = taskElement.querySelector('input[type="checkbox"]');
    const uniqueId = checkbox.id;
    

    let styleElement = taskElement.querySelector('style');
    if (!styleElement) {
      styleElement = document.createElement('style');
      taskElement.appendChild(styleElement);
    }
    

    styleElement.textContent = `
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
  };

  const taskTextElement = taskElement.querySelector('.home-tasks__text');

  taskTextElement.addEventListener('mousedown', () => startPress(taskElement));
  taskTextElement.addEventListener('mouseup', cancelPress);
  taskTextElement.addEventListener('mouseleave', cancelPress);

  taskTextElement.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startPress(taskElement);
  });
  taskTextElement.addEventListener('touchend', cancelPress);
  taskTextElement.addEventListener('touchcancel', cancelPress);

  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentTaskElement) return;

    const updatedTask = {
      text: taskTextInput.value,
      time: taskTimeInput.value,
      category: taskCategoryInput.value,
      completed: currentTaskElement.querySelector('input[type="checkbox"]').checked
    };

    
    updateTaskColors(currentTaskElement, updatedTask.category);
    
    onSave(updatedTask, currentTaskElement);
    modal.classList.add('hidden');
    currentTaskElement = null;
  });
}