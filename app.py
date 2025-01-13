from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Хранение адресов
storage_addresses = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_address', methods=['POST'])
def add_address():
    data = request.json
    address = data.get('address')
    if address and validate_address(address):
        storage_addresses.append(address)
        return jsonify({"status": "success", "message": f"Адрес {address} добавлен"})
    return jsonify({"status": "error", "message": "Неверный формат адреса"})

@app.route('/add_range', methods=['POST'])
def add_range():
    data = request.json
    start = data.get('start')
    end = data.get('end')
    if start and end and validate_address(start) and validate_address(end):
        addresses = generate_address_range(start, end)
        storage_addresses.extend(addresses)
        return jsonify({"status": "success", "message": f"Добавлено {len(addresses)} адресов"})
    return jsonify({"status": "error", "message": "Неверный диапазон"})

@app.route('/get_addresses', methods=['GET'])
def get_addresses():
    filter_query = request.args.get('filter', '').upper()
    filtered_addresses = [addr for addr in storage_addresses if filter_query in addr]
    return jsonify({"status": "success", "addresses": filtered_addresses})

def validate_address(address):
    # Проверка формата адреса: XX-99-99-99
    parts = address.split('-')
    if len(parts) != 4:
        return False
    row, column, cell, place = parts
    return (
        row.isalpha() and
        column.isdigit() and
        cell.isdigit() and
        place.isdigit()
    )

def generate_address_range(start, end):
    # Логика для генерации диапазона адресов
    addresses = []
    start_parts = start.split('-')
    end_parts = end.split('-')
    
    # Пример: от A-01-01-01 до A-01-01-03
    for place in range(int(start_parts[3]), int(end_parts[3]) + 1):
        address = f"{start_parts[0]}-{start_parts[1]}-{start_parts[2]}-{place:02d}"
        addresses.append(address)
    
    return addresses

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')