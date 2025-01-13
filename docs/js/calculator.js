let searchResults = [];

function searchByAddress() {
    const address = document.getElementById('address-search').value;
    if (validateAddress(address)) {
        fetchResults(address, 'address');
    } else {
        showError('Некорректный формат адреса');
    }
}

function searchByContent() {
    const query = document.getElementById('content-search').value.trim();
    if (query.length >= 3) {
        fetchResults(query, 'content');
    } else {
        showError('Введите минимум 3 символа');
    }
}

function validateAddress(address) {
    const regex = /^[A-Za-z]{1,2}-\d{2}-\d{2}-\d{2}$/;
    return regex.test(address);
}

function fetchResults(query, type) {
    // Здесь будет запрос к серверу
    const mockData = [
        {
            address: 'VA-34-01-14',
            content: 'Коробка с документами',
            description: 'Синяя коробка, 2020 год'
        },
        {
            address: 'CD-88-22-66',
            content: 'Оборудование',
            description: 'Серверное оборудование, 2019 год'
        }
    ];
    
    searchResults = mockData.filter(item => {
        if (type === 'address') {
            return item.address === query;
        } else {
            return item.content.toLowerCase().includes(query.toLowerCase()) ||
                   item.description.toLowerCase().includes(query.toLowerCase());
        }
    });
    
    displayResults();
}

function displayResults() {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    if (searchResults.length === 0) {
        resultsContainer.innerHTML = '<p>Ничего не найдено</p>';
        return;
    }

    searchResults.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="address-tag">${item.address}</div>
            <h4>${item.content}</h4>
            <p>${item.description}</p>
        `;
        resultsContainer.appendChild(resultItem);
    });
}

function showError(message) {
    alert(message);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Можно добавить начальную загрузку данных
}); 