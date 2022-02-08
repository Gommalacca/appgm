# Simple backend

Written in nodejs + typescript + sequelize + passport + postgres + docker

## Routes:

Download postman from [Here]([https://www.postman.com/]) Install and use the exported apis from postman folder.

## Default access:

### Postgres:

host: localhost:5432 user: postgres password: postgres db: postgres

### Auth:

All access inside src/database/seeders/seederDb.ts

## Want to start with docker?

Initialize backend with docker:

`$ docker build -t myapp .`

`$ docker run myapp`

Rembemer to set .env file!
