## Создание базы данных и пользователя

```
psql --username postgres

CREATE DATABASE videosrv;
CREATE USER videosrvuser WITH PASSWORD 'password';
ALTER ROLE videosrvuser SET client_encoding TO 'utf8';
ALTER ROLE videosrvuser SET default_transaction_isolation TO 'read committed';
ALTER ROLE viseosrvuser SET timezone TO 'UTC';
postgres=# GRANT ALL PRIVILEGES ON DATABASE videosrv TO videosrvuser;

ALTER USER videosrvuser CREATEDB; #Если нужна возможность запуска тестов

\q
```