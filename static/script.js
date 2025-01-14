// Глобальные переменные для хранения выбранных значений
let selectedRow = null;
let selectedColumn = null;
let selectedCell = null;
let selectedPlace = null;

// Инициализация выпадающих списков
document.addEventListener('DOMContentLoaded', () => {
    initDropdown('rowDropdown', generateLetters('A', 'ZZ'), 'row');
    initDropdown('columnDropdown', generateNumbers(1, 99), 'column');
    initDropdown('cellDropdown', generateNumbers(1, 99), 'cell');
    initDropdown('placeDropdown', generateNumbers(1, 99), 'place');
});

// Генерация букв от A до ZZ
function generateLetters(start, end) {
    const letters = [];
    for (let i = start.charCodeAt(0); i <= end.charCodeAt(0); i++) {
        letters.push(String.fromCharCode(i));
    }
    // Добавляем двойные буквы (AA-ZZ)
    for (let i = start.charCodeAt(0); i <= end.charCodeAt(0); i++) {
        for (let j = start.charCodeAt(0); j <= end.charCodeAt(0); j++) {
            letters.push(String.fromCharCode(i) + String.fromCharCode(j));
        }
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

// Обработка выбора чекбокса
function handleSelection(checkbox, type) {
    const value = checkbox.value;

    // Сброс предыдущего выбора для текущего типа
    const dropdown = checkbox.closest('.dropdown');
    if (dropdown) {
        const checkboxes = dropdown.querySelectorAll('.dropdown-checkbox');
        checkboxes.forEach(cb => {
            if (cb !== checkbox) {
                cb.checked = false; // Снимаем выбор с других чекбоксов
            }
        });
    }

    // Запоминаем выбранное значение
    switch (type) {
        case 'row':
            selectedRow = checkbox.checked ? value : null;
            updateButtonText('rowDropdown', selectedRow, 'Ряды');
            break;
        case 'column':
            selectedColumn = checkbox.checked ? value : null;
            updateButtonText('columnDropdown', selectedColumn, 'Колонны');
            break;
        case 'cell':
            selectedCell = checkbox.checked ? value : null;
            updateButtonText('cellDropdown', selectedCell, 'Ячейки');
            break;
        case 'place':
            selectedPlace = checkbox.checked ? value : null;
            updateButtonText('placeDropdown', selectedPlace, 'Места');
            break;
    }

    // Обновляем отображение выбранного адреса
    updateSelectedAddresses();
}

// Обновление текста кнопки
function updateButtonText(dropdownId, selectedValue, defaultText) {
    const button = document.querySelector(`button[onclick="toggleDropdown('${dropdownId}')"]`);
    if (button) {
        button.textContent = selectedValue ? `${defaultText} (${selectedValue})` : `${defaultText}`;
    }
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