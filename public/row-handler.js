const RowHandler = (() => {
  const init = (entriesEl, entryItems, selectedEntryItems) => {

    entriesEl.addEventListener('click', (e) => {
      if (isIconClicked(e)) {
        const iconEl = getIconElement(e);
        const entryEl = iconEl.closest('.entry-item');
        handleAction(iconEl.dataset.action, entryEl);
      } else {
        const entryEl = e.target.closest('.entry-item');

        if (entryEl.classList.contains('is-editing')) {
          return;
        }

        const id = entryEl.querySelector('.id').dataset.id; 
        const entryItem = entryItems.find(entry => entry.id == id);
        const selectedEntryIndex = selectedEntryItems.indexOf(entryItem);
        if (selectedEntryIndex < 0) {
          selectedEntryItems.push(entryItem);
        } else {
          selectedEntryItems.splice(selectedEntryIndex, 1);
        }

        entriesEl.dispatchEvent(new CustomEvent(
          'selectedEntryItemsChanged',
          {
            bubbles: true,
            cancellable: true,
          }
        ));
        toggleEntrySelected(entryEl);
      }
    });

    function isIconClicked(e) {
      return (
        e.target.classList.contains('icon')
        || e.target.classList.contains('icon-inner')
      );
    }

    function getIconElement(e) {
      if (e.target.classList.contains('icon')) {
        return e.target;
      } else if (e.target.classList.contains('icon-inner')) {
        return e.target.parentNode;
      } 
    }

    function handleAction(action, entryEl) {
      let handler;
      switch (action) {
        case 'edit':
          handler = editActionHandler;
          break;
        case 'save':
          handler = saveActionHandler;
          break;
        case 'delete':
          handler = deleteActionHandler;
          break;
      }
      handler(entryEl);
    }

    function editActionHandler(entryEl) {
      entryEl.classList.add('is-editing');
      setEditingControlsVisibility(true, entryEl);
    }

    function saveActionHandler(entryEl) {
      entryEl.classList.remove('is-editing');
      setEditingControlsVisibility(false, entryEl);
      saveEntry(entryEl);
    }

    function setEditingControlsVisibility(isEditing, entryEl) {
      const frontEl = entryEl.querySelector('.front');
      const frontEditEl = entryEl.querySelector('.front-edit');

      const backEl = entryEl.querySelector('.back');
      const backEditEl = entryEl.querySelector('.back-edit');

      const editIcon = entryEl.querySelector('[data-action="edit"]');
      const saveIcon = entryEl.querySelector('[data-action="save"]');

      if (isEditing) {
        frontEl.classList.add('is-hidden');
        frontEditEl.classList.remove('is-hidden');

        backEl.classList.add('is-hidden');
        backEditEl.classList.remove('is-hidden');

        editIcon.classList.add('is-hidden');
        saveIcon.classList.remove('is-hidden');
      } else {
        frontEl.classList.remove('is-hidden');
        frontEditEl.classList.add('is-hidden');

        backEl.classList.remove('is-hidden');
        backEditEl.classList.add('is-hidden');

        editIcon.classList.remove('is-hidden');
        saveIcon.classList.add('is-hidden');
      }
    }

    function saveEntry(entryEl) {
      const id = parseInt(entryEl.querySelector('.id').dataset.id);
      const editedFront = entryEl.querySelector('.front-edit').value;
      const editedBack = entryEl.querySelector('.back-edit').value;

      const newEntry = {
        id,
        front: editedFront,
        back: editedBack,
      };

      updateDomEntry(entryEl, newEntry);
      updateEntryItems(newEntry);
    }

    function updateDomEntry(entryEl, entry) {
      const frontEl = entryEl.querySelector('.front');
      const backEl = entryEl.querySelector('.back');
      
      frontEl.innerHTML = entry.front;
      backEl.innerHTML = entry.back;
    }

    function updateEntryItems(newEntry) {
      const index = entryItems.findIndex(
        entry => entry.id == newEntry.id
      );

      entryItems[index] = {...entryItems[index], ...newEntry};
    }

    function deleteActionHandler(entryEl) {
      entries.removeChild(entryEl);

      const id = entryEl.querySelector('.id').dataset.id;
      const index = entryItems.findIndex(
        entry => entry.id == id
      );

      entryItems.splice(index, 1);
    }

    function toggleEntrySelected(entryEl) {
      entryEl.classList.toggle('is-selected');
      entryEl.querySelector('.front').classList.toggle('has-text-white');
      entryEl.querySelector('.back').classList.toggle('has-text-white');
      entryEl.querySelector('[data-action="edit"]').classList.toggle('is-hidden');
      entryEl.querySelector('[data-action="delete"]').classList.toggle('is-hidden');
    }
    
  }

  return { init };
})();
