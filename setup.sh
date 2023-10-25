#!/bin/sh

sudo apt-get update
sudo apt-get upgrade -y
sudo apt install unzip
sudo apt install nodejs npm -y
sudo mkdir opt
sudo mv /home/admin/webapp.zip /home/admin/opt/webapp.zip
sudo mv /home/admin/users.csv /home/admin/opt/webapp/users.csv
cd opt
sudo unzip -o webapp.zip
cd webapp
sudo npm i
sudo cp /home/admin/aws-debian.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable aws-debian.service
sudo systemctl start aws-debian.service