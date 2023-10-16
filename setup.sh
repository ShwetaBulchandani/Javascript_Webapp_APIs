#!/bin/sh

# Check if running in GitHub Actions
if [ -n "${GITHUB_ACTIONS}" ]; then
  # In GitHub Actions, copy the content of .env directly
  echo "${{ secrets.MY_ENV_VARIABLE }}" > .env
fi

if [ -f .env ]; then
  source .env
else
  echo "Error: .env file not found"
  exit 1
fi

sudo apt-get update
sudo apt-get upgrade -y
sudo apt install unzip
sudo apt install nodejs npm -y
sudo apt install mariadb-server -y
sudo mysql -e "SET PASSWORD FOR root@localhost = PASSWORD('$MYSQL_ROOT_PASSWORD');FLUSH PRIVILEGES;"
printf '$MYSQL_ROOT_PASSWORD\n n\n n\n n\n n\n n\n y\n' | sudo mysql_secure_installation
sudo mysql -e "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO 'root'@'localhost' IDENTIFIED BY '$MYSQL_ROOT_PASSWORD';"
mysql -u root -p$MYSQL_ROOT_PASSWORD -Bse "CREATE DATABASE $MYSQL_DATABASE;"
mysql -u root -p$MYSQL_ROOT_PASSWORD -Bse "SHOW DATABASES;"
sudo mkdir opt
sudo mv /home/admin/webapp.zip /home/admin/opt/webapp.zip
sudo mv /home/admin/users.csv /home/admin/opt/webapp/users.csv
cd opt
sudo unzip -o webapp.zip
cd webapp
sudo npm i
sudo npm run test
# sudo npm start