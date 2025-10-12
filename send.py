import paramiko
import shutil
import os

SSH_HOST = '192.168.1.82'
SSH_USER = 'dmitry'
SSH_PASS = '123qwerty'
REMOTE_DIR = f'/home/dmitry/ABartaj/'

# SSH_HOST = '192.168.1.76'
# SSH_USER = 'franklin'
# SSH_PASS = '123qwerty'
# REMOTE_DIR = f'/home/dmitry/UCloud/'


while True:
    inputDamp = input('Введите имя локального файла: ')

    if inputDamp == '000':
        exit()

    elif os.path.exists(inputDamp):
        SOURCE_FILE = inputDamp
        TARGET_FILE = inputDamp  # Используем оригинальное имя

        try:
            ssh_client = paramiko.SSHClient()
            ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh_client.connect(hostname=SSH_HOST, username=SSH_USER, password=SSH_PASS)
            sftp = ssh_client.open_sftp()
            try:
                # Проверяем существует ли файл на сервере и удаляем
                sftp.stat(os.path.join(REMOTE_DIR, TARGET_FILE))
                sftp.remove(os.path.join(REMOTE_DIR, TARGET_FILE))
                print('Файл заменен✂')
            except IOError:
                pass  # Файл не найден, продолжаем дальше
            
            # Передаем файл на сервер
            sftp.put(SOURCE_FILE, os.path.join(REMOTE_DIR, TARGET_FILE))
            print('Update завершен успешно!🟢')

        finally:
            # Закрываем SFTP-сессию и SSH-соединение
            if sftp:
                sftp.close()
            if ssh_client:
                ssh_client.close()
            
            print(f'Файл {TARGET_FILE} отправлен и временные копии не создавались 🟢')
            input('Продолжить...')

    else:
        print(f'Я не нашел файл {inputDamp}')
