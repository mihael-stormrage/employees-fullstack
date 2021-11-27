all: server client
install: backend frontend
db-setup: db-create schema-load

schema-load:
	psql energozapas < schema.sql

db-create:
	createdb energozapas

backend:
	cd server && npm i

frontend:
	cd client && yarn

build-frontend:
	npm --prefix ./client build

server:
	npm --prefix ./server start

client:
	npm --prefix ./client start

prod:

