
(function () {
  const $taskList = document.querySelector('[data-name="taskList"]');
  const $inputText = document.querySelector('[data-name="inputText"]');
  const $btnAdd = document.querySelector('[data-name="btnAdd"]');
  const $startMsg = document.querySelector('#startMsg');

  class Task {
    constructor (text) {
      this.text = text;
      this.isDone = false;
      this.id = Math.floor(Math.random() * new Date()).toString();
    }
  }

// ---------- dataServis ----------

const dataServis = {
  storege: [],
  notCompletedStorege: [],

  addTask: function (text) {
    text = text.toString().trim();
    if (text !== '') {
      const newTask = new Task(text);
      this.storege.push(newTask);
      this.saveData();
    }
  },
  deleteTask: function (id) {
    const currentTask = this.storege.find(task => task.id === id);
    const index = this.storege.indexOf(currentTask);
    this.storege.splice(index, 1);
    this.saveData();
  },
  updateTask: function (id, text) {
    const currentTask = this.storege.find(task => task.id === id);
    currentTask.text = text;
    this.saveData();
  },
  setIsDone: function (id ,bool) {
    this.storege.forEach(item => {
      if (item.id === id) {
        item.isDone = bool;
      }
    });
    this.saveData();
  },
  getNotCompleted() {
    if (this.storege.length > 0) {
      this.notCompletedStorege = [];
      this.storege.forEach(task => {
        if (task.isDone === false) {
          this.notCompletedStorege.push(task);
        }
      });
    }
  },
  isCompleted () {
    let completedTask = false;

    this.storege.find(item => {
      if (item.isDone === true) {
        completedTask = true;
        console.log(item.isDone);
      }
    });
    return completedTask;
  },
  loadData() {
    this.storege = JSON.parse(localStorage.getItem('todoList'));
  },
  saveData() {
    localStorage.setItem('todoList', JSON.stringify(this.storege));
  },
  getAllTasks: function () {
    return this.storege;
  }
}

// ---------- View ----------

  class View {
    render (storegeType = dataServis.storege) {
      $taskList.innerHTML = '';
     
      storegeType.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('taskList__item');
        li.dataset.id = task.id;

        const p = document.createElement('p');
        p.textContent = task.text;
        p.classList.add('taskList__text');
  
        const div = document.createElement('div');
        div.classList.add('taskList__tools');
  
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('taskList__checkbox');
        checkbox.dataset.name = 'isDone';
        checkbox.checked = task.isDone;
  
        const updateBtn = document.createElement('input');
        updateBtn.type = 'button';
        updateBtn.value = 'Update';
        updateBtn.classList.add('taskList__updateBtn');
        updateBtn.dataset.name = 'updateBtn';
  
        const delBtn = document.createElement('input');
        delBtn.type = 'button';
        delBtn.value = 'X';
        delBtn.classList.add('taskList__delBtn');
        delBtn.dataset.name = 'delBtn';

        li.appendChild(p);
        li.appendChild(div);

        div.appendChild(checkbox);
        div.appendChild(updateBtn);
        div.appendChild(delBtn);

        $taskList.appendChild(li);
      });
    }

    renderUpdateTask(taskElem) {
      const currentTaskId = taskElem.dataset.id;
      const task = dataServis.storege.find(task => task.id === currentTaskId);
      const index = dataServis.storege.indexOf(task);

      const p = taskElem.children[0];
      const inputUpdate = document.createElement('input');
      const inputApplyBtn = document.createElement('input');

      inputApplyBtn.type = 'button';
      inputApplyBtn.classList.add('taskList__inputApplyBtn');
      inputApplyBtn.dataset.name = 'inputApplyBtn';
      inputApplyBtn.value = 'Ok';

      inputUpdate.type = 'text';
      inputUpdate.classList.add('taskList__updateInput');
      inputUpdate.dataset.name = 'inputUpdate';
      inputUpdate.value = task.text;
      
      p.innerHTML = '';
      
      p.appendChild(inputUpdate);
      p.appendChild(inputApplyBtn);
      
    }

    showStartMsg () {
      if (dataServis.storege.length > 0) {
        $startMsg.hidden = true;
      } else {
        $startMsg.hidden = false;
      }
    }
  }

  const view = new View();

// -------------- addTask --------------

  function addTaskHendler () {
    if ($inputText.value) {
      dataServis.addTask($inputText.value);
      view.render();
      $inputText.value = '';
      view.showStartMsg();
    }
  }

// --------- taskListControlsHendler ---------

  function taskListControlsHendler (e) {
    if (e.target.dataset.name === 'taskList') { return }

    // -------------- delBtn --------------

    if (e.target.dataset.name === 'delBtn') {
      const currentItemId = e.target.parentElement.parentElement.dataset.id;
      dataServis.deleteTask(currentItemId);
      e.target.parentElement.parentElement.remove();
      view.showStartMsg();
    }

    // -------------- setIsDone --------------

    if (e.target.dataset.name === 'isDone') {
      const currentElemId = e.target.parentElement.parentElement.dataset.id;
      dataServis.setIsDone(currentElemId, e.target.checked);
    }

    // -------------- updateBtn --------------

    if (e.target.dataset.name === 'updateBtn') {
      const currentTask = e.target.parentElement.parentElement;
      const currentTaskId = e.target.parentElement.parentElement.dataset.id;
      view.renderUpdateTask(currentTask);
      const $inputUpdate = document.querySelector('[data-name="inputUpdate"]');
      const $inputApplyBtn = document.querySelector('[data-name="inputApplyBtn"]');
      
      function applyUpdetedTextHendler () {
        dataServis.updateTask(currentTaskId, $inputUpdate.value);
        view.render();
      }

      $inputApplyBtn.addEventListener('click', applyUpdetedTextHendler);
      $inputUpdate.addEventListener('keydown', (e) => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
          applyUpdetedTextHendler();
        }
      });
    }
  }
  
// --------- addTaskHendler ---------

  $btnAdd.addEventListener('click', addTaskHendler);
  $inputText.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      addTaskHendler();
    }
  });

// --------- filterHendlers ---------

  const allBtn = document.querySelector('[data-name="allBtn"]');
  const notCompletedBtn = document.querySelector('[data-name="notCompletedBtn"]');

  allBtn.addEventListener('click', function (e) {
    if (!allBtn.classList.contains('selected')) {
      allBtn.classList.add('selected');
      notCompletedBtn.classList.remove('selected');
    }
    dataServis.loadData();
    view.render();
  });

  notCompletedBtn.addEventListener('click', (e) => {
    if (dataServis.isCompleted()) {
      notCompletedBtn.classList.add('selected');
      allBtn.classList.remove('selected');
    }
    dataServis.getNotCompleted();
    view.render(dataServis.notCompletedStorege);

  });

  $taskList.addEventListener('click', taskListControlsHendler);
 
  window.addEventListener("load", function () {
    if (localStorage.getItem('todoList')) {
      dataServis.loadData();
      view.render();
      view.showStartMsg();
    }
  });
}());