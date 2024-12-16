export function createModal() {
  const modal = document.createElement('div');
  modal.id = 'taskModal';
  modal.className = 'modal hidden';
  modal.innerHTML = `
      <div class="modal-content">
        <h2>Додати нову задачу</h2>
        <form id="taskForm">
          <label for="taskText">Задача:</label>
          <input type="text" id="taskText" placeholder="Введіть текст задачі" required />
          
          <label for="taskCategory">Категорія:</label>
          <select id="taskCategory">
            <option>Робота</option>
            <option >Особисте</option>
            <option>Покупки</option>
            <option>Здоров&#39;я</option>
          </select>
          
          <label for="taskTime">Час:</label>
          <input type="time" id="taskTime" required />
          
          <button type="submit">Додати</button>
        </form>
        <button id="closeModal">
        <span class="material-icons-outlined">close</span></button>
      </div>
    `;
  document.body.appendChild(modal);
}

// Налаштування подій для модального вікна
export function setupModalEvents(openButtonId, onTaskSubmit) {
  const modal = document.getElementById('taskModal');
  const closeModal = document.getElementById('closeModal');
  const taskForm = document.getElementById('taskForm');
  const openButton = document.getElementById(openButtonId);

  openButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskData = {
      text: document.getElementById('taskText').value,
      category: document.getElementById('taskCategory').value,
      time: document.getElementById('taskTime').value,
    };
    onTaskSubmit(taskData);
    modal.classList.add('hidden');
    taskForm.reset();
  });
}
