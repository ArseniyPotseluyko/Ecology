# Backend API - Экология и мир

Flask backend для информационного ресурса о заповедниках Беларуси.

## Быстрый старт

```bash
# Установка зависимостей
pip install -r requirements.txt

# Запуск сервера
python app.py
```

Сервер запустится на `http://localhost:5001`

## Структура базы данных

### Таблицы

- **users** - пользователи системы
- **animals** - животные заповедников
- **cabins** - домики для бронирования
- **bookings** - бронирования домиков
- **favorites** - избранные заповедники пользователей
- **feedback** - обратная связь
- **user_activity** - история активности
- **notifications** - уведомления
- **privacy_settings** - настройки приватности

### Автоматическая миграция

При первом запуске сервер автоматически:
1. Создаст базу данных `ecology.db`
2. Создаст все необходимые таблицы
3. Загрузит данные о животных из Википедии
4. Загрузит информацию о домиках

При последующих запусках:
- Проверит структуру таблиц
- Добавит недостающие колонки (если есть)
- Сохранит все существующие данные

## API Endpoints

### Заповедники

- `GET /api/reserves` - список всех заповедников
- `GET /api/reserves/<id>` - информация о заповеднике
- `GET /api/reserves/<id>/animals` - животные заповедника
- `GET /api/reserves/<id>/cabins` - домики заповедника
- `GET /api/reserves/<id>/weather` - прогноз погоды
- `POST /api/reserves/<id>/bookings` - создать бронирование

### Пользователи

- `POST /api/users/register` - регистрация
- `POST /api/users/login` - авторизация
- `GET /api/users/<id>/profile` - получить профиль
- `PATCH /api/users/<id>/profile` - обновить профиль (с загрузкой аватара)
- `PATCH /api/users/<id>` - обновить имя
- `PATCH /api/users/<id>/password` - сменить пароль

### Избранное

- `GET /api/users/<id>/favorites` - список избранных
- `POST /api/users/<id>/favorites` - добавить в избранное
- `DELETE /api/users/<id>/favorites/<reserve_id>` - удалить из избранного
- `PATCH /api/users/<id>/favorite-reserve` - установить основной заповедник

### Активность и уведомления

- `GET /api/users/<id>/activity` - история активности
- `POST /api/users/<id>/activity` - записать активность
- `DELETE /api/users/<id>/activity` - очистить историю
- `GET /api/users/<id>/notifications` - получить уведомления
- `PATCH /api/users/<id>/notifications/<notif_id>/read` - отметить прочитанным

### Приватность

- `GET /api/users/<id>/privacy` - получить настройки
- `PATCH /api/users/<id>/privacy` - обновить настройки

### Обратная связь

- `POST /api/feedback` - отправить сообщение
- `GET /api/users/<id>/feedback` - список обращений пользователя

### Бронирования

- `GET /api/users/<id>/bookings` - бронирования пользователя

### Служебные

- `GET /api/health` - проверка работоспособности
- `GET /uploads/avatars/<filename>` - получить аватар

## Загрузка аватаров

### Требования

- Форматы: JPG, PNG, GIF
- Максимальный размер: 5 МБ
- Папка: `backend/uploads/avatars/`

### Пример запроса

```javascript
const formData = new FormData();
formData.append('name', 'Иван Иванов');
formData.append('bio', 'Люблю природу');
formData.append('location', 'Минск, Беларусь');
formData.append('avatar', fileInput.files[0]);

fetch(`http://localhost:5001/api/users/${userId}/profile`, {
  method: 'PATCH',
  body: formData
});
```

## Миграция базы данных

### Автоматическая (рекомендуется)

Просто запустите сервер - миграции применятся автоматически:
```bash
python app.py
```

### Ручная

Если нужно применить миграции без запуска сервера:
```bash
python migrate_db.py
```

### Пересоздание БД (удалит все данные!)

```bash
rm ecology.db
python app.py
```

## Внешние API

Backend использует следующие внешние API:

1. **Wikipedia API** - для получения описаний животных
   - URL: `https://ru.wikipedia.org/api/rest_v1/page/summary/{title}`
   - Не требует ключа

2. **Open-Meteo API** - для прогноза погоды
   - URL: `https://api.open-meteo.com/v1/forecast`
   - Не требует ключа

## Безопасность

- Пароли хешируются с использованием SHA-256 и соли
- Email уникален и не может быть изменен после регистрации
- Загружаемые файлы проверяются на допустимые расширения
- Размер загружаемых файлов ограничен 5 МБ
- SQL-инъекции предотвращаются использованием параметризованных запросов

## Разработка

### Структура проекта

```
backend/
├── app.py              # Основной файл приложения
├── ecology.db          # База данных SQLite
├── migrate_db.py       # Скрипт миграции
├── requirements.txt    # Зависимости Python
├── uploads/            # Загруженные файлы
│   └── avatars/        # Аватары пользователей
├── README.md           # Эта документация
└── MIGRATION_GUIDE.md  # Руководство по миграции
```

### Зависимости

- Flask - веб-фреймворк
- Flask-CORS - обработка CORS
- Werkzeug - утилиты для работы с файлами

### Порт

По умолчанию используется порт **5001** (чтобы избежать конфликтов с AirPlay на macOS).

Изменить порт можно через переменную окружения:
```bash
PORT=5000 python app.py
```

## Устранение проблем

### Ошибка: "Address already in use"

Порт 5001 занят. Остановите другой процесс или измените порт:
```bash
PORT=5002 python app.py
```

### Ошибка: "Permission denied" при загрузке аватара

Проверьте права на папку:
```bash
chmod 755 uploads/avatars
```

### База данных заблокирована

Закройте все подключения к БД и перезапустите сервер.

## Тестирование

### Проверка работоспособности

```bash
curl http://localhost:5001/api/health
```

Ответ:
```json
{"status": "ok", "message": "API работает корректно"}
```

### Получение списка заповедников

```bash
curl http://localhost:5001/api/reserves
```

## Лицензия

Образовательный проект. Использование в коммерческих целях требует разрешения.
