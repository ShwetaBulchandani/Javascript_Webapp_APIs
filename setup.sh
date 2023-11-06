#!/bin/sh

sudo apt-get update
sudo apt-get upgrade -y
sudo apt install unzip
sudo apt install nodejs npm -y

sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

sudo mv /home/admin/webapp.zip /opt/csye6225/webapp.zip
sudo mv /home/admin/users.csv /opt/csye6225/users.csv
cd /opt/csye6225
sudo unzip -o webapp.zip
cd /opt/csye6225/webapp
sudo npm i
sudo chown -R csye6225:csye6225 /opt/csye6225
sudo cp /home/admin/webapp.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service
sudo apt install amazon-cloudwatch-agent -y
