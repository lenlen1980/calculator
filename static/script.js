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
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (dropdown.id !== dropdownId) {
            dropdown.style.display = 'none'; // Закрываем другие списки
        }
    });

    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        if (dropdown.style.display === 'block') {
            // Позиционирование списка рядом с кнопкой
            const button = document.querySelector(`button[onclick="toggleDropdown('${dropdownId}')"]`);
            if (button) {
                const rect = button.getBoundingClientRect();
                dropdown.style.position = 'absolute';
                dropdown.style.top = `${rect.bottom + window.scrollY}px`;
                dropdown.style.left = `${rect.left + window.scrollX}px`;
            }

            // Плавное появление
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                dropdown.style.opacity = '1';
                dropdown.style.transform = 'translateY(0)';
            }, 10);
        }
    }
}

// Обработка выбора элемента
function handleItemClick(dropdownId, item, event) {
    event.stopPropagation(); // Останавливаем всплытие события
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        // Добавляем/убираем выделение
        item.classList.toggle('selected');

        // Закрываем список после выбора
        dropdown.style.display = 'none';

        // Обновляем текст кнопки
        updateButtonText(dropdownId);
    }
}

// Обновление текста кнопки
function updateButtonText(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    const button = document.querySelector(`button[onclick="toggleDropdown('${dropdownId}')"]`);
    if (!button) return;

    const selectedItems = dropdown.querySelectorAll('span.selected');
    const selectedValues = Array.from(selectedItems).map(item => item.textContent);

    if (selectedValues.length > 0) {
        // Если выбраны элементы, отображаем их в кнопке
        button.textContent = `${button.dataset.originalText}: ${selectedValues.join(', ')}`;
    } else {
        // Если ничего не выбрано, возвращаем исходный текст
        button.textContent = button.dataset.originalText;
    }
}

// Обновление чекбокса
function updateCheckbox(dropdownId, value, isSelected) {
    const checkboxContainer = document.getElementById(`${dropdownId}-checkboxes`);
    if (!checkboxContainer) return;

    let checkbox = checkboxContainer.querySelector(`input[value="${value}"]`);
    if (!checkbox && isSelected) {
        // Создаем новый чекбокс, если его нет
        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = value;
        checkbox.id = `${dropdownId}-${value}`;
        checkbox.checked = true;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = value;

        // Добавляем чекбокс в соответствующий контейнер
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
    } else if (checkbox && !isSelected) {
        // Удаляем чекбокс, если выбор снят
        checkbox.nextElementSibling.remove(); // Удаляем label
        checkbox.remove(); // Удаляем input
    }
}

// Обработка ручного ввода с фильтрацией
function handleManualInput(type) {
    const inputId = `${type}Input`;
    const dropdownId = `${type}Dropdown`;
    const inputValue = document.getElementById(inputId).value.trim().toUpperCase();

    // Фильтрация элементов списка
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        const labels = dropdown.querySelectorAll('label');
        labels.forEach(label => {
            const text = label.textContent.trim().toUpperCase();
            if (text.includes(inputValue)) {
                label.style.display = 'block';
            } else {
                label.style.display = 'none';
            }
        });
    }

    // Обновление выбранного значения
    switch (type) {
        case 'row':
            selectedRow = inputValue ? inputValue : null;
            updateButtonText('rowDropdown', selectedRow, 'Ряды');
            break;
        case 'column':
            selectedColumn = inputValue ? inputValue : null;
            updateButtonText('columnDropdown', selectedColumn, 'Колонны');
            break;
        case 'cell':
            selectedCell = inputValue ? inputValue : null;
            updateButtonText('cellDropdown', selectedCell, 'Ячейки');
            break;
        case 'place':
            selectedPlace = inputValue ? inputValue : null;
            updateButtonText('placeDropdown', selectedPlace, 'Места');
            break;
    }

    // Обновляем отображение выбранного адреса
    updateSelectedAddresses();
}

// Добавление диапазона адресов
function addAddressRange() {
    const selectedList = document.getElementById('selectedRangeList');
    const dropdowns = document.querySelectorAll('.dropdown-range');

    // Собираем выбранные элементы
    let addressParts = [];
    dropdowns.forEach(dropdown => {
        const selectedItems = dropdown.querySelectorAll('span.selected');
        if (selectedItems.length > 0) {
            const category = dropdown.id.replace('RangeDropdown', ''); // Получаем категорию (Ряды, Колонны и т.д.)
            const values = Array.from(selectedItems).map(item => item.textContent);
            if (values.length > 1) {
                // Если выбрано несколько элементов, формируем диапазон
                const range = `${values[0]}-${values[values.length - 1]}`;
                addressParts.push(`${category}: ${range}`);
            } else {
                // Если выбран один элемент, добавляем его
                addressParts.push(`${category}: ${values[0]}`);
            }
        }
    });

    // Если диапазон собран (все части выбраны)
    if (addressParts.length > 0) {
        const fullRange = addressParts.join(', '); // Формируем полный диапазон
        const existingItem = Array.from(selectedList.children).find(el => el.textContent === fullRange);

        if (!existingItem) {
            const div = document.createElement('div');
            div.textContent = fullRange; // Отображаем полный диапазон
            selectedList.appendChild(div); // Добавляем в список
        }
    }

    // Закрываем все выпадающие списки
    dropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
    });

    // Логирование для отладки
    console.log('Диапазон добавлен:', addressParts.join(', '));
}

// Генерация списков для диапазонов
function generateDropdownItems() {
    // Генерация рядов от A до ZZ
    const rowDropdown = document.getElementById('rowRangeDropdown');
    if (rowDropdown) {
        rowDropdown.innerHTML = ''; // Очищаем список
        for (let i = 65; i <= 90; i++) { // A-Z
            const letter = String.fromCharCode(i);
            const span = document.createElement('span');
            span.textContent = letter;
            span.onclick = (event) => handleItemClick('rowRangeDropdown', span, event);
            rowDropdown.appendChild(span);
        }
        for (let i = 65; i <= 90; i++) { // AA-ZZ
            for (let j = 65; j <= 90; j++) {
                const letters = String.fromCharCode(i) + String.fromCharCode(j);
                const span = document.createElement('span');
                span.textContent = letters;
                span.onclick = (event) => handleItemClick('rowRangeDropdown', span, event);
                rowDropdown.appendChild(span);
            }
        }
    }

    // Генерация колонн, ячеек и мест от 1 до 99
    const numberDropdowns = ['columnRangeDropdown', 'cellRangeDropdown', 'placeRangeDropdown'];
    numberDropdowns.forEach(id => {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.innerHTML = ''; // Очищаем список
            for (let i = 1; i <= 99; i++) {
                const span = document.createElement('span');
                span.textContent = i;
                span.onclick = (event) => handleItemClick(id, span, event);
                dropdown.appendChild(span);
            }
        }
    });
}

// Инициализация кнопок при загрузке страницы
window.onload = function() {
    generateDropdownItems(); // Генерация списков

    // Сохраняем исходные тексты кнопок
    const buttons = document.querySelectorAll('.button-group button');
    buttons.forEach(button => {
        button.dataset.originalText = button.textContent;
    });
}; 