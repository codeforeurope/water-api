#!/bin/bash
sed -i "s^__MONGO_SERVER__^$MONGO_SERVER^g" /water-api/config/config.json
sed -i "s^__SECRET__^$SECRET^g" /water-api/config/config.json
sed -i "s^__DB_PREFIX__^$DB_PREFIX^g" /water-api/config/config.json

cd /water-api
npm start
