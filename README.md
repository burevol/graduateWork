# Итоговый проект SkillFactory: FPW-2.0

## Установка и запуск

### Запуск контейнеров

```
docker-compose up -d
```

### Запуск бэкэнда

```
pip install -r ./requirements.txt
py .\manage.py migrate
py .\manage.py createsuperuser
py .\manage.py runserver
```

### Запуск фронтэнда

```
npm install
npm start
```

