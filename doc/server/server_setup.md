# Introduction

The following file describe how to set up the server for the project. 

# install node
First, install Node.js on the server. This can be done by downloading the latest version at [the Node js official website](https://nodejs.org/en/download) 
or by running ```sudo apt-get install nodejs```.

# install npm
run the ```npm --version``` command. If a version number is returned, you can skip this step.
Otherwise, npm can be install by running ```sudo apt-get install npm```

## Other dependencies
To run the server other dependencies must be met. Their installation is described in the following sections.

The dependencies to install are:
- [express](https://expressjs.com/)
- [axios](https://github.com/axios/axios)
- [node-rsa](https://www.npmjs.com/package/node-rsa)
- [form-data](https://www.npmjs.com/package/form-data)
- https

Before installing each one of them, please check that they're not already installed by using ```npm view [package]```. If a description of the package is returned, you can skip this particular installation. If not, please run  ```npm install [package]```

# install bdd

## mariadb
The website make use of a database to store some of its informations. The one that was used during developpment is MariaDB; and it will be the one that this documentation will use. However, it is also possible to install mysql.
To install mariaDB, run the following commands, 
If not already installed, please install pip with ```sudo apt install python3-pip``` (for python3)
Then, run,
```
sudo apt-get install mariadb-server mariadb-client
sudo apt-get install -y libmariadb-dev
```

## python

In order to fill the BDD, some python packages are needed,
```
pip install pandas
pip install mariadb
```
if error MariaDB Connector/Python requires MariaDB Connector/C >= 3.X.x, found version 3.Y.y follows, please follow those instructions, 
```
sudo apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 0xcbcb082a1bb943db
curl -LsS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | sudo bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
sudo apt-get install libmariadb3
sudo apt-get install libmariadb-dev
sudo pip3 install mariadb
sudo apt install mariadb-server
```

# setup bdd

### window note : please execute the following command in your SQL Client
```ALTER TABLE manga CONVERT TO CHARACTER SET utf8;```

To setup the bdd,
```
cd ./server/sql
python3 fillInBDD.py
```

WARNING: in the .csv files, please leave the foreign keys in the case of associations at the end of file

# API

## Imgur API

When all of this is done, we just have to link Imgur API with our server. To do so, go to the [registration form](https://imgur.com/signin?redirect=https%3A%2F%2Fapi.imgur.com%2Foauth2%2Faddclient) and add [xxx.xxx.xxx.xxx]/token as the callback URL. This allows the server to 
request tokens in case we need to send data to imgur.
