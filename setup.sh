#!/bin/sh
sudo apt-get update
sudo apt-get upgrade -y
sudo apt install unzip
sudo apt install nodejs npm -y
sudo apt install mariadb-server -y
sudo mysql -e "SET PASSWORD FOR root@localhost = PASSWORD('9822684461mM@12');FLUSH PRIVILEGES;"
printf '9822684461mM@12\n n\n n\n n\n n\n n\n y\n' | sudo mysql_secure_installation
sudo mysql -e "GRANT ALL PRIVILEGES ON cloud_db.* TO 'root'@'localhost' IDENTIFIED BY '9822684461mM@12';"
mysql -u root -p9822684461mM@12 -Bse "CREATE DATABASE cloud_db;"
mysql -u root -p9822684461mM@12 -Bse "SHOW DATABASES;"
sudo mkdir opt
sudo mv /home/admin/webapp.zip /home/admin/opt/webapp.zip
sudo mv /home/admin/users.csv /home/admin/opt/webapp/users.csv
cd opt
sudo unzip -o webapp.zip
cd webapp
sudo npm i
sudo npm run test
# sudo npm start