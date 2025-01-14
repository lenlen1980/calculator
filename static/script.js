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
            const values = Array.from(selectedItems).map(item => item.textContent);
            if (values.length > 1) {
                // Формируем диапазон (например, A-C или 1-3)
                addressParts.push(`${values[0]}-${values[values.length - 1]}`);
            } else {
                // Если выбран один элемент, добавляем его
                addressParts.push(values[0]);
            }
        } else {
            // Если ничего не выбрано, добавляем пустое значение
            addressParts.push('');
        }
    });

    // Формируем строку в формате XX-99-99-99
    const fullRange = addressParts.join('-');

    // Проверяем, чтобы все части были заполнены
    if (addressParts.every(part => part !== '')) {
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
    console.log('Диапазон добавлен:', fullRange);
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

// Добавление произвольного диапазона
function addCustomRange() {
    const startInput = document.getElementById('customRangeStart');
    const endInput = document.getElementById('customRangeEnd');
    const selectedList = document.getElementById('selectedRangeList');

    const startValue = startInput.value.trim().toUpperCase();
    const endValue = endInput.value.trim().toUpperCase();

    // Проверка формата ввода
    if (!isValidRangeFormat(startValue) || !isValidRangeFormat(endValue)) {
        alert('Некорректный формат диапазона. Используйте формат XX-99-99-99.');
        return;
    }

    // Разбиваем начальный и конечный адреса на части
    const [startRow, startCol, startCell, startPlace] = startValue.split('-');
    const [endRow, endCol, endCell, endPlace] = endValue.split('-');

    // Генерация всех адресов в диапазоне
    const allAddresses = generateAddressRange(startRow, endRow, startCol, endCol, startCell, endCell, startPlace, endPlace);

    // Добавляем все адреса в список
    allAddresses.forEach(address => {
        const existingItem = Array.from(selectedList.children).find(el => el.textContent === address);
        if (!existingItem) {
            const div = document.createElement('div');
            div.textContent = address; // Отображаем адрес
            selectedList.appendChild(div); // Добавляем в список
        }
    });

    // Очищаем поля ввода
    startInput.value = '';
    endInput.value = '';
}

// Генерация всех адресов в диапазоне
function generateAddressRange(startRow, endRow, startCol, endCol, startCell, endCell, startPlace, endPlace) {
    const addresses = [];

    // Генерация рядов
    const rows = generateRange(startRow, endRow, true);
    // Генерация колонн, ячеек и мест
    const cols = generateRange(startCol, endCol, false);
    const cells = generateRange(startCell, endCell, false);
    const places = generateRange(startPlace, endPlace, false);

    // Формируем все возможные комбинации
    rows.forEach(row => {
        cols.forEach(col => {
            cells.forEach(cell => {
                places.forEach(place => {
                    addresses.push(`${row}-${col}-${cell}-${place}`);
                });
            });
        });
    });

    return addresses;
}

// Генерация диапазона (для рядов и чисел)
function generateRange(start, end, isLetter) {
    const range = [];
    let current = start;

    while (current <= end) {
        range.push(current);
        current = isLetter ? incrementLetter(current) : incrementNumber(current);
    }

    return range;
}

// Увеличение буквенного значения (A -> B, Z -> AA, AZ -> BA)
function incrementLetter(letter) {
    let result = '';
    let carry = 1;

    for (let i = letter.length - 1; i >= 0; i--) {
        let charCode = letter.charCodeAt(i) + carry;
        if (charCode > 90) { // Z -> AA
            charCode = 65; // A
            carry = 1;
        } else {
            carry = 0;
        }
        result = String.fromCharCode(charCode) + result;
    }

    if (carry) result = 'A' + result; // Если был перенос (ZZ -> AAA)
    return result;
}

// Увеличение числового значения (01 -> 02, 99 -> 100)
function incrementNumber(num) {
    return String(Number(num) + 1).padStart(2, '0');
}

// Проверка формата диапазона
function isValidRangeFormat(value) {
    const regex = /^[A-Z]{1,2}-\d{2}-\d{2}-\d{2}$/;
    return regex.test(value);
}

// Добавление адреса в список
function addAddressToList(address) {
    const selectedList = document.getElementById('selectedRangeList');

    // Проверяем, чтобы адрес не был уже добавлен
    const existingItem = Array.from(selectedList.children).find(el => el.textContent === address);
    if (!existingItem) {
        const div = document.createElement('div');
        div.textContent = address; // Отображаем адрес

        // Добавляем кнопку удаления (крестик)
        const removeButton = document.createElement('button');
        removeButton.textContent = '×';
        removeButton.className = 'remove-button';
        removeButton.onclick = () => div.remove(); // Удаляем элемент при клике

        div.appendChild(removeButton); // Добавляем кнопку в элемент
        selectedList.appendChild(div); // Добавляем в список
    }
}

// Пример использования
addAddressToList('P-01-01-01'); 

// Очистка всех адресов
function clearAllAddresses() {
    const selectedList = document.getElementById('selectedRangeList');
    selectedList.innerHTML = ''; // Удаляем все элементы из списка
}

// Генерация всех комбинаций адресов
function generateAllAddresses(rows, columns, cells, places) {
    const addresses = [];

    rows.forEach(row => {
        columns.forEach(column => {
            cells.forEach(cell => {
                places.forEach(place => {
                    // Формируем адрес в формате PP-56-54-76
                    const address = `${row}-${column.padStart(2, '0')}-${cell.padStart(2, '0')}-${place.padStart(2, '0')}`;
                    addresses.push(address);
                });
            });
        });
    });

    return addresses;
}

// Обработка добавления адресов
function addAddressesFromSelection() {
    // Получаем выбранные значения
    const selectedRows = Array.from(document.querySelectorAll('#rowRangeDropdown input'))
        .map(input => input.value.toUpperCase())
        .filter(value => isValidRow(value));

    const selectedColumns = Array.from(document.querySelectorAll('#columnRangeDropdown input'))
        .map(input => input.value.padStart(2, '0'))
        .filter(value => isValidNumber(value));

    const selectedCells = Array.from(document.querySelectorAll('#cellRangeDropdown input'))
        .map(input => input.value.padStart(2, '0'))
        .filter(value => isValidNumber(value));

    const selectedPlaces = Array.from(document.querySelectorAll('#placeRangeDropdown input'))
        .map(input => input.value.padStart(2, '0'))
        .filter(value => isValidNumber(value));

    // Генерируем все комбинации
    const allAddresses = generateAllAddresses(selectedRows, selectedColumns, selectedCells, selectedPlaces);

    // Добавляем адреса в список
    allAddresses.forEach(address => {
        addAddressToList(address);
    });
}

// Пример использования
addAddressesFromSelection(); 

// Разбиение сложного адреса на отдельные адреса
function splitComplexAddress(complexAddress) {
    const parts = complexAddress.split('-');
    if (parts.length !== 8) {
        return []; // Некорректный формат
    }

    const [row1, row2, col1, col2, cell1, cell2, place1, place2] = parts;

    // Генерация всех комбинаций
    const addresses = [];
    const rows = [row1, row2];
    const columns = [col1, col2];
    const cells = [cell1, cell2];
    const places = [place1, place2];

    rows.forEach(row => {
        columns.forEach(column => {
            cells.forEach(cell => {
                places.forEach(place => {
                    const address = `${row}-${column.padStart(2, '0')}-${cell.padStart(2, '0')}-${place.padStart(2, '0')}`;
                    addresses.push(address);
                });
            });
        });
    });

    return addresses;
}

// Обработка добавления адресов
function addComplexAddress(complexAddress) {
    const addresses = splitComplexAddress(complexAddress);

    if (addresses.length === 0) {
        alert('Некорректный формат адреса. Используйте формат B-D-3-4-4-5-3-4.');
        return;
    }

    // Добавляем все адреса в список
    addresses.forEach(address => {
        addAddressToList(address);
    });
}

// Пример использования
addComplexAddress('B-D-3-4-4-5-3-4'); // Преобразуется в B-3-4-3, B-3-5-4, B-4-4-3, B-4-5-4, D-3-4-3, D-3-5-4, D-4-4-3, D-4-5-4 