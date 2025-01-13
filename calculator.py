def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

def multiply(x, y):
    return x * y

def divide(x, y):
    if y == 0:
        raise ValueError("Нельзя делить на ноль!")
    return x / y

def main():
    print("Добро пожаловать в калькулятор!")
    while True:
        print("\nВыберите операцию:")
        print("1. Сложение")
        print("2. Вычитание")
        print("3. Умножение")
        print("4. Деление")
        print("5. Выход")

        choice = input("Введите номер операции: ")

        if choice == '5':
            print("Выход из калькулятора.")
            break

        try:
            num1 = float(input("Введите первое число: "))
            num2 = float(input("Введите второе число: "))
        except ValueError:
            print("Ошибка: введите числа!")
            continue

        if choice == '1':
            print(f"Результат: {add(num1, num2)}")
        elif choice == '2':
            print(f"Результат: {subtract(num1, num2)}")
        elif choice == '3':
            print(f"Результат: {multiply(num1, num2)}")
        elif choice == '4':
            try:
                print(f"Результат: {divide(num1, num2)}")
            except ValueError as e:
                print(e)
        else:
            print("Неверный выбор. Попробуйте снова.")

if __name__ == "__main__":
    main() 