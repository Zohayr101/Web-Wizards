
const openPopup = document.getElementById('add_task');
const closePopup = document.getElementById('close_task');
const popup = document.getElementById('task_popup');


openPopup.addEventListener('click', () => {
    popup.style.display = 'flex';
});


closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});


window.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});
