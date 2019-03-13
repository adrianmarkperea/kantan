const mainEl = document.getElementById('main');
const quizEl = document.getElementById('quiz');

const STATE_MAIN = 'MAIN';
const STATE_QUIZ = 'QUIZ';

const ENTRIES_LOCAL_STORAGE_KEY = 'entries';

const stateEls = {};
stateEls[STATE_MAIN] = mainEl;
stateEls[STATE_QUIZ] = quizEl;

const entriesEl = document.getElementById('entries');
const entryItems = JSON.parse(
  localStorage.getItem(ENTRIES_LOCAL_STORAGE_KEY)
) || [
  {
    id: 1,
    front: 'Ohayougozaimasu',
    back: 'Good morning',
  },
  {
    id: 2,
    front: 'Konnichwa',
    back: 'Good afternoon',
  },
  {
    id: 3,
    front: 'Konbanwa',
    back: 'Good evening',
  },
];

const selectedEntryItems = [];

RowHandler.init(entriesEl, entryItems, selectedEntryItems);

const App = ((stateEls, entriesEl, entryItems, selectedEntryItems) => {

  const currentState = STATE_MAIN;

  const addButton = document.getElementById('add-button');
  const saveButton = document.getElementById('save-button');
  const quizButton = document.getElementById('quiz-button');
  const backToMainButton = document.getElementById('back-to-main');

  const init = () => {
    entriesEl.addEventListener('selectedEntryItemsChanged', () => {
      if (selectedEntryItems.length < 2) {
        quizButton.setAttribute('disabled', 'true');
      } else {
        quizButton.removeAttribute('disabled');
      }
    });

    entryItems.forEach(entry => addNewEntryToDom(entry));

    addButton.addEventListener('click', () => {
      let maxId = 0;
      entryItems.forEach(entry => {
        maxId = entry.id > maxId
          ? entry.id
          : maxId; 
      });

      addNewEntryItem({id: maxId + 1, front: '', back: ''}, true);
      
      entriesEl.lastChild.querySelector('.front-edit').focus();
    });

    saveButton.addEventListener('click', () => {
      saveButton.classList.add('is-loading');
      setTimeout(() => {
        localStorage.setItem(ENTRIES_LOCAL_STORAGE_KEY, JSON.stringify(entryItems));
        saveButton.classList.remove('is-loading');
      }, 1000);
    });

    quizButton.addEventListener('click', () => {
      (new Quiz(quizEl, selectedEntryItems)).render();
      
      render(STATE_QUIZ);
    });

    backToMainButton.addEventListener('click', () => {
      render(STATE_MAIN);
    });
  }

  const addNewEntryItem = (entry, isEditing = false) => {
    entryItems.push(entry);
    addNewEntryToDom(entry, isEditing);
  };

  const addNewEntryToDom = (entry, isEditing = false) => {
    const entryEl = document.createElement('div');
    entryEl.classList.add('columns', 'entry-item'); 

    if (isEditing) {
      entryEl.classList.add('is-editing');
    }

    // FIXME: LOL repeated code too lazy to fix
    if (isEditing) {
      entryEl.innerHTML = `
        <span class="id is-hidden" data-id="${entry.id}"></span>
        <div class="column is-two-fifths">
          <input class="input front-edit" type="text" value="${entry.front}">
          <p class="front is-hidden">${entry.front}</p> 
        </div> 
        <div class="column is-two-fiths">
          <input class="input back-edit" type="text" value="${entry.back}">
          <p class="back is-hidden">${entry.back}</p>
        </div> 
        <div class="column is-one-fifth">
          <div class="entry-controls has-text-right">
            <span class="icon control-item is-hidden" data-action="edit">
              <i class="far fa-edit fa-lg icon-inner"></i>  
            </span>
            <span class="icon control-item" data-action="save">
              <i class="far fa-check-square fa-lg icon-inner"></i>  
            </span>
            <span class="icon control-item" data-action="delete">
              <i class="far fa-minus-square fa-lg icon-inner"></i>  
            </span>
          </div>
        </div>
      `;

    } else {
      entryEl.innerHTML = `
        <span class="id is-hidden" data-id="${entry.id}"></span>
        <div class="column is-two-fifths">
          <input class="input front-edit is-hidden" type="text" value="${entry.front}">
          <p class="front">${entry.front}</p> 
        </div> 
        <div class="column is-two-fiths">
          <input class="input back-edit is-hidden" type="text" value="${entry.back}">
          <p class="back">${entry.back}</p>
        </div> 
        <div class="column is-one-fifth">
          <div class="entry-controls has-text-right">
            <span class="icon control-item" data-action="edit">
              <i class="far fa-edit fa-lg icon-inner"></i>  
            </span>
            <span class="icon control-item is-hidden" data-action="save">
              <i class="far fa-check-square fa-lg icon-inner"></i>  
            </span>
            <span class="icon control-item" data-action="delete">
              <i class="far fa-minus-square fa-lg icon-inner"></i>  
            </span>
          </div>
        </div>
      `;
    }

    entriesEl.appendChild(entryEl);
  };

  const render = (state) => {
    Object.values(stateEls).forEach(el => {
      el.classList.add('is-hidden');
    });
    
    stateEls[state].classList.remove('is-hidden');
  }

  return { init, render };

})(stateEls, entriesEl, entryItems, selectedEntryItems);

App.init();
