# chess-reviewer

A project that analyzes chess games.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Environment](#environment)
  - [With Docker](#with-docker)
  - [Without Docker](#without-docker)
    - [Analysis service](#analysis-service)
    - [API service](#api-service)
    - [Web Application service](#web-application-service)
- [RabbitMQ & Celery](#rabbitmq--celery)
  - [RabbitMQ Installation](#rabbitmq-installation)
    - [Erlang (required)](#erlang-required)
    - [Install RabbitMQ](#install-rabbitmq)
    - [Start RabbitMQ](#start-rabbitmq)
  - [Start Celery worker](#start-celery-worker)

## Prerequisites

Before running the project, make sure you have the following installed:

- Python 3.9+
- PostgreSQL 12+
- Docker & Docker Compose
- Git
- Node

## Installation

### Environment

Go to the `backend` folder and create a new file named `.env` with this inside:

```.env
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
DB_HOST=
DB_PORT=

ANALYZER_API_URL=
CELERY_BROKER_URL=
```

And set your environment variables.

Go to the `frontend` folder and do the same:

```.env
VITE_STATIC_ROUTE=
VITE_API_ROUTE=
VITE_PORT=
```

### With Docker

You can use this docker command:

```sh
docker compose up --build -d
```

Ensure that all you containers are up and running:

```sh
✔ Container cr_db          Started
✔ Container cr_rabbitmq    Started
✔ Container cr_analyzer    Started
✔ Container cr_api         Started
✔ Container cr_celery      Started
```

You can also use the `docker ps` command to check your containers.

Start the `frontend`:

```sh
cd frontend

bun install

bun dev
```

### Without Docker

#### Analysis service

Make sure that you have the following installed:

- curl
- wget
- make
  Go in the `analyzer` folder:

```sh
cd analyzer
```

You need to install the Stockfish binary with this command:

```sh
make build
```

Or with `git clone`:

```sh
git clone https://github.com/official-stockfish/Stockfish.git src/bin/stockfish
```

Install the packages with `bun` or `npm` and start the app:

```sh
# Bun
bun install
bun dev

# Npm
npm install
npm run dev
```

#### API service

Create your venv:

```sh
python3 -m venv .venv
source .venv/bin/activate
```

Go to your `backend` folder with `cd backend`.

Install requirements:

```sh
pip3 install -r requirements.txt
```

Database settings

The project is configured to use PostgreSQL on port 5433. If you need to modify the database settings, update the `DATABASES` configuration in [app/settings.py](backend/app/settings.py):

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'my-api-db',
        'USER': 'my_api_admin',
        'PASSWORD': 'PASSWORD',
        'HOST': '127.0.0.1',
        'PORT': '5433',
    }
}
```

Apply migrations:

```sh
python3 manage.py migrate
```

Start the application:

```sh
python3 manage.py runserver
```

#### Web Application service

Start the `frontend`:

```sh
cd frontend

bun install

bun dev
```

## RabbitMQ & Celery

When running the project without Docker, you need to install and start RabbitMQ manually, then run Celery so asynchronous tasks can be processed.

#### RabbitMQ Installation

##### Erlang (required)

RabbitMQ requires Erlang to be installed first.

**Linux (Debian/Ubuntu)**

```sh
sudo apt-get update
sudo apt-get install erlang
```

```sh
brew install erlang
```

##### Install RabbitMQ

```sh
# Linux
sudo apt-get install rabbitmq-server

# MacOs
brew install rabbitmq
```

##### Start RabbitMQ

```sh
# Linux
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server

# MacOs
brew services start rabbitmq
```

In your [backend/.env](backend/.env) file, configure the broker URL and analyzer service:

```
CELERY_BROKER_URL=amqp://guest:guest@127.0.0.1:5672//
ANALYZER_API_URL=http://127.0.0.1:3000
```

##### Start Celery worker

```sh
celery -A app worker -l info
```
