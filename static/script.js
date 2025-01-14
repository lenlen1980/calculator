// Глобальные переменные для хранения выбранных значений
let selectedRow = null;
let selectedColumn = null;
let selectedCell = null;
let selectedPlace = null;

// Инициализация выпадающих списков
document.addEventListener('DOMContentLoaded', () => {
    initDropdown('rowDropdown', generateLetters('A', 'Z'), 'row');
    initDropdown('columnDropdown', generateNumbers(1, 99), 'column');
    initDropdown('cellDropdown', generateNumbers(1, 99), 'cell');
    initDropdown('placeDropdown', generateNumbers(1, 99), 'place');
});

// Генерация букв от A до Z
function generateLetters(start, end) {
    const letters = [];
    for (let i = start.charCodeAt(0); i <= end.charCodeAt(0); i++) {
        letters.push(String.fromCharCode(i));
    }
    return letters;
}

// Генерация чисел от start до end
function generateNumbers(start, end) {
    const numbers = [];
    for (let i = start; i <= end; i++) {
        numbers.push(i);
    }
    return numbers;
}

// Инициализация выпадающего списка
function initDropdown(dropdownId, items, type) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    dropdown.innerHTML = items.map(item => `
        <label>
            <input type="checkbox" class="dropdown-checkbox" data-type="${type}" value="${item}" onclick="handleSelection(this, '${type}')">
            ${item}
        </label>
    `).join('');
}

// Обработка выбора
function handleSelection(checkbox, type) {
    const value = checkbox.value;

    switch (type) {
        case 'row':
            selectedRow = checkbox.checked ? value : null;
            break;
        case 'column':
            selectedColumn = checkbox.checked ? value : null;
            break;
        case 'cell':
            selectedCell = checkbox.checked ? value : null;
            break;
        case 'place':
            selectedPlace = checkbox.checked ? value : null;
            break;
    }

    updateSelectedAddresses();
}

// Обновление выбранных адресов
function updateSelectedAddresses() {
    const selectedList = document.getElementById('selectedList');
    if (!selectedList) return;

    if (selectedRow && selectedColumn && selectedCell && selectedPlace) {
        const address = `${selectedRow}-${selectedColumn}-${selectedCell}-${selectedPlace}`;
        selectedList.innerHTML = `<div class="selected-address">${address}</div>`;
    } else {
        selectedList.innerHTML = '<div class="selected-address">Выберите все параметры.</div>';
    }
}

// Переключение видимости выпадающего списка
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
} 