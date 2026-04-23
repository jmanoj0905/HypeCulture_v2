#!/bin/sh
set -eu

mysql -uroot -p"$MYSQL_ROOT_PASSWORD" < /opt/hypeculture/sql/schema.sql
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" hypeculture_db < /opt/hypeculture/sql/stored-procedures.sql
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" hypeculture_db < /opt/hypeculture/sql/triggers.sql
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" hypeculture_db < /opt/hypeculture/sql/seed-data.sql
