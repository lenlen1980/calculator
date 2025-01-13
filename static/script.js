// Добавление одного адреса
async function addSingleAddress() {
    const row = document.getElementById('row').value.trim().toUpperCase();
    const column = document.getElementById('column').value;
    const cell = document.getElementById('cell').value;
    const place = document.getElementById('place').value;

    if (!row || !column || !cell || !place) {
        alert("Заполните все поля!");
        return;
    }

    const address = `${row}-${column.padStart(2, '0')}-${cell.padStart(2, '0')}-${place.padStart(2, '0')}`;

    const response = await fetch('/add_address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
    });

    const result = await response.json();
    alert(result.message);
    if (result.status === "success") {
        loadAddresses();
    }
}

// Добавление диапазона адресов
async function addAddressRange() {
    const startRow = document.getElementById('start-row').value.trim().toUpperCase();
    const startColumn = document.getElementById('start-column').value;
    const startCell = document.getElementById('start-cell').value;
    const startPlace = document.getElementById('start-place').value;

    const endRow = document.getElementById('end-row').value.trim().toUpperCase();
    const endColumn = document.getElementById('end-column').value;
    const endCell = document.getElementById('end-cell').value;
    const endPlace = document.getElementById('end-place').value;

    if (!startRow || !startColumn || !startCell || !startPlace || !endRow || !endColumn || !endCell || !endPlace) {
        alert("Заполните все поля!");
        return;
    }

    const start = `${startRow}-${startColumn.padStart(2, '0')}-${startCell.padStart(2, '0')}-${startPlace.padStart(2, '0')}`;
    const end = `${endRow}-${endColumn.padStart(2, '0')}-${endCell.padStart(2, '0')}-${endPlace.padStart(2, '0')}`;

    const response = await fetch('/add_range', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start, end })
    });

    const result = await response.json();
    alert(result.message);
    if (result.status === "success") {
        loadAddresses();
    }
}

// Загрузка адресов
async function loadAddresses() {
    const filter = document.getElementById('filter').value.trim().toUpperCase();
    const response = await fetch(`/get_addresses?filter=${filter}`);
    const result = await response.json();

    const addressesDiv = document.getElementById('addresses');
    addressesDiv.innerHTML = result.addresses.map(addr => `
        <div class="address-card">${addr}</div>
    `).join('');
}

// Фильтрация адресов
function filterAddresses() {
    loadAddresses();
}

// Инициализация
document.addEventListener('DOMContentLoaded', loadAddresses); 