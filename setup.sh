#!/bin/sh


# Check if running in GitHub Actions

if [ -n "${GITHUB_ACTIONS}" ]; then
  # In GitHub Actions, copy the content of .env directly
  echo "password=${{ secrets.PASSWORD }}" > .env
  echo "database=${{ secrets.DATABASE }}" >> .env
fi

if [ -f .env ]; then
  # Load environment variables from .env file
  export $(cat .env | xargs)
else
  echo "Error: .env file not found"
  exit 1
fi

source .env

sudo apt-get update
sudo apt-get upgrade -y
sudo apt install unzip
sudo apt install nodejs npm -y
sudo apt install mariadb-server -y
sudo mysql -e "SET PASSWORD FOR root@localhost = PASSWORD('$PASSWORD');FLUSH PRIVILEGES;"
printf '$PASSWORD\n n\n n\n n\n n\n n\n y\n' | sudo mysql_secure_installation
sudo mysql -e "GRANT ALL PRIVILEGES ON $DATABASE.* TO 'root'@'localhost' IDENTIFIED BY '$PASSWORD';"
mysql -u root -p$PASSWORD -Bse "CREATE DATABASE $DATABASE;"
mysql -u root -p$PASSWORD -Bse "SHOW DATABASES;"
sudo mkdir opt
sudo mv /home/admin/webapp.zip /home/admin/opt/webapp.zip
sudo mv /home/admin/users.csv /home/admin/opt/webapp/users.csv
cd opt
sudo unzip -o webapp.zip
cd webapp
sudo npm i
sudo npm run test
# sudo npm start