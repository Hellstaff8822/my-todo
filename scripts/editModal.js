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
  const closeModal = document.querySelector('.close-btn');  // Змінений селектор
  const editForm = document.getElementById('editTaskForm');
  const taskTextInput = document.getElementById('editTaskText');
  const taskTimeInput = document.getElementById('editTaskTime');
  const taskCategoryInput = document.getElementById('editTaskCategory');

  const taskTextElement = taskElement.querySelector('.home-tasks__text');

  const startPress = () => {
      pressTimer = setTimeout(() => {
          const taskText = taskElement.querySelector('.home-tasks__text').textContent;
          const taskTime = taskElement.querySelector('.home-tasks__time').textContent.replace(/delete/, '').trim();
          const taskCategory = taskElement.querySelector('.home-tasks__category').textContent;

          taskTextInput.value = taskText;
          taskTimeInput.value = taskTime;
          taskCategoryInput.value = taskCategory;

          modal.classList.remove('hidden');
      }, 500);
  };

  const cancelPress = () => {
      clearTimeout(pressTimer);
  };

  taskTextElement.addEventListener('mousedown', startPress);
  taskTextElement.addEventListener('mouseup', cancelPress);
  taskTextElement.addEventListener('mouseleave', cancelPress);

  taskTextElement.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startPress();
  });
  taskTextElement.addEventListener('touchend', cancelPress);
  taskTextElement.addEventListener('touchcancel', cancelPress);

  closeModal.addEventListener('click', () => {
      modal.classList.add('hidden');
  });

  editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const updatedTask = {
          text: taskTextInput.value,
          time: taskTimeInput.value,
          category: taskCategoryInput.value,
          completed: taskElement.querySelector('input[type="checkbox"]').checked
      };

      onSave(updatedTask, taskElement);
      modal.classList.add('hidden');
  });
}