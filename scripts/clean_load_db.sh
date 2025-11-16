#!/bin/bash

ENV_FILE="./backend/.env"

if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo "File .env not found: $ENV_FILE"
  exit 1
fi

if [ -z "$1" ]; then
  echo "Usage: ./load_db.sh path/to/dump.sql"
  exit 1
fi

DUMP_FILE="$1"

if [ ! -f "$DUMP_FILE" ]; then
  echo "File not found: $DUMP_FILE"
  exit 1
fi

echo "Warning: the database '$POSTGRES_DB' will be overwritten!"
read -p "Confirm loading? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Operation cancelled."
  exit 0
fi

DB_NAME="\"$POSTGRES_DB\""

echo "Dropping and recreating database '$POSTGRES_DB' ..."
docker exec -i cr_db psql -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
docker exec -i cr_db psql -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"


echo "Loading database from $DUMP_FILE ..."
docker exec -i cr_db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < "$DUMP_FILE"
    

if [ $? -eq 0 ]; then
  echo "Database loaded successfully from $DUMP_FILE"
else
  echo "Failed to load the database."
fi
