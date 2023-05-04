const addTask = document.querySelector(".push_btn"); //кнопка добавить
const input = document.querySelector(".input_task");

//==============клик по кнопке инпут с нажатием ентер=============
input.addEventListener("keypress", (event) => {
  if (input.value.length !== 0) {
    addTask.disabled = false;
    if (event.key === "Enter") {
      addNewTask(input);
    }
  } else {
    addTask.disabled = true;
  }
});

//===============нажатие на кнопку добавить=======================
if (input.value.length === 0) {
  addTask.disabled = true;
}
addTask.addEventListener("click", () => {
  addNewTask(input);
});
const todos = [];
//================Список пуст====================================
const tasks = document.querySelector("#tasks"); //контейнер задач

function generateId() {
  return parseInt(Math.random() * 100 + todos.length / 0.02);
}

function displayEmpty() {
  if (tasks.children.length !== 1) {
    let emptyMessage = document.querySelector(".empty");
    emptyMessage.style.display = "none";
  } else {
    let emptyMessage = document.querySelector(".empty");
    emptyMessage.style.display = "block";
  }
}
function addNewTask(input) {
  addTask.disabled = true;
  //======================добавление задачи======================
  let taskText = input.value;
  // ==============структура для хранения списка==================
  const newToDo = {};
  const id = generateId();
  newToDo.id = `${id}`;
  newToDo.content = input.value;
  newToDo.date = new Date();
  todos.push(newToDo);
  const formatedDate = formatDate();

  //=====================создаем запись для задач=======================
  tasks.innerHTML += `
                <div class="task" id=${id}>
                    <input class="selected_task" name="selected_task" type="radio" />
                    <input class="text_task" type = "text" value="${taskText}" readOnly="true" />
                    <div class="date"> ${formatedDate}
                    </div>
                    <div class="edit">
                    </div>   
                    <div class="delete">
                    </div>
                </div>
            `;
  //===============================================================
  displayEmpty();
  input.value = ""; //очищаю инпут
  //================================================================
  let deleteButtons = document.querySelectorAll(".delete");
  let editButtons = document.querySelectorAll(".edit");
  let selectedTasks = document.querySelectorAll('input[name="selected_task"]');

  //=====================найти текст задачи=========================
  function findTextTask(task) {
    let parentTask = task.parentElement; //< class="task">
    let currTask = parentTask.children[1]; //
    return currTask.value;
  }

  for (let i = 0; i < deleteButtons.length; i++) {
    //=======================клик на кнопку удалить=====================
    deleteButtons[i].onclick = function () {
      const idOfDelItem = deleteButtons[i].parentElement.id;
      for (let i = 0; i < todos.length; i++) {
        if (idOfDelItem === todos[i].id) {
          todos.splice(i, 1);
        }
      }

      deleteButtons[i].parentNode.remove();
      displayEmpty();
    };

    //=======================кнопка реадктировать===============
    editButtons[i].onclick = () => {
      let parentTask = editButtons[i].parentElement; //< class="task">
      let task = parentTask.children[0]; //<input id="selected_task">
      let taskName = parentTask.children[1]; //input class="text_task"
      parentTask.children[2].style.display = "none";
      parentTask.children[2].textContent = "";
      taskName.style.border = "1px solid #40c245";
      deleteButtons[i].style.display = "none"; //кнопка удалить
      editButtons[i].style.display = "none"; //кнопка редактировать
      taskName.readOnly = false; //поле редактируется

      //==================создание= кнопки сохранить===================
      let saveButton = document.createElement("button");
      saveButton.className = "save";
      saveButton.innerHTML = "Сохранить";
      parentTask.appendChild(saveButton); // привязка на task
      displayEmpty();
      //===================клик на кнопку сохранить====================
      saveButton.onclick = () => {
        task.style.display = "block";
        taskName.style.display = "block";
        deleteButtons[i].style.display = "block";
        editButtons[i].style.display = "block";
        parentTask.children[2].style.display = "block";
        taskText = `${taskName.value.trim()}`;
        saveButton.style.display = "none"; //скрытие кнопки сохранить
        taskName.readOnly = true;
        taskName.style.border = "none";
        parentTask.children[2].textContent = formatDate();
        for (let i = 0; i < todos.length; i++) {
          if (todos[i].id === parentTask.id) {
            todos.content = taskName.value;
          }
        }
      };
    };
  }

  //================форматирование даты=====================
  function formatDate() {
    let date = new Date();
    let currDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    );

    let options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return currDate.toLocaleString("ru", options);
  }

  //====================DONE=== выполненные задачи=======================
  //пробегаемя по выделенным задачам
  for (const selectedTask of selectedTasks) {
    selectedTask.addEventListener("change", showSelected);
  }
  function showSelected(e) {
    let doneTasks = document.querySelector(".done_tasks");
    if (this.checked) {
      let taskText = findTextTask(this);
      doneTasks.innerHTML += `
              <div class="done_task">
                  <div class="done_task_name"><s>${taskText}</s></div>
                  <div class="done_delete">
                  </div>
               </div>
              `;
      this.parentElement.remove();
    }
    //==================удаление выполненных задач========================
    let deleteDoneBtns = document.querySelectorAll(".done_delete");
    for (let i = 0; i < deleteDoneBtns.length; i++) {
      deleteDoneBtns[i].onclick = function () {
        deleteDoneBtns[i].parentNode.remove();
      };
    }
  }
}
