import json
from os import system

DB = 'app.json'




print(f'Будет использоваться база данных {DB}')


def createApp():
    try:
        with open('CopyBright.txt', 'r', encoding='UTF-8') as labada:
            raw_content = labada.read()
            # КРИТИЧЕСКИЙ МОМЕНТ: парсим строку в словарь
            # .strip() уберет лишние пробелы/переносы по краям, если они есть
            new_entry = json.loads(raw_content.strip())
        # 1. Читаем существующий файл
        # Используем utf-8, чтобы кириллица в твоем файле не поплыла
        with open('app.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Проверяем, что в файле реально список (array)
        if isinstance(data, list):
            # 2. Добавляем новый объект в конец списка
            data.append(new_entry)
            
            # 3. Сохраняем обновленный список обратно в файл
            with open('app.json', 'w', encoding='utf-8') as f:
                # indent=2 сделает красивую структуру, 
                # ensure_ascii=False сохранит русский текст читаемым
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            print("Всё чётко! Объект добавлен в конец app.json")
        else:
            print("Ошибка: JSON в файле не является списком [].")

    except Exception as e:
        print(f"Что-то пошло не так: {e}")



def deliteApp():
    try:
        # 1. Загружаем данные
        with open(DB, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not isinstance(data, list):
            print("Ошибка: В файле должен быть список [].")
            return

        # 2. Спрашиваем, кого карать
        target_idi = input("Введите idi для удаления: ").strip()
        
        # Запоминаем длину списка до удаления
        initial_count = len(data)
        
        # 3. Фильтруем список (оставляем всех, у кого idi не совпадает)
        data = [item for item in data if item.get('idi') != target_idi]
        
        # 4. Проверяем, удалилось ли что-то
        if len(data) < initial_count:
            with open(DB, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Готово! Объект с idi '{target_idi}' удален.")
        else:
            print(f"Объект с idi '{target_idi}' не найден. Ничего не изменилось.")

    except FileNotFoundError:
        print(f"Ошибка: Файл {DB} не найден.")
    except Exception as e:
        print(f"Произошла какая-то дичь: {e}")


while True:
    system('cls')
    vib = input('Выберите действие:\n0--Выйти\n1--Записать апликацию\n2--Удалить апликацию\n>>> ')
    if vib == '0':
        exit()
    elif vib == '1':
        createApp()
    elif vib == '2':
        deliteApp()