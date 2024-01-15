-- SQL
-- Create the database structure

CREATE DATABASE bluesolo;
USE bluesolo;
SOURCE D:\Utilisateurs\Benjebara\Downloads\siteweb\BS_website\server\sql\scripts\bdd_init.sql 
SOURCE D:\Utilisateurs\Benjebara\Downloads\siteweb\BS_website\server\sql\scripts\staff.sql

-- Create the users with the values contained inside mysql_database.md
-- Warning: the passwords for these users shall be modified before putting the project in a production environment !

CREATE USER 'bs'@'localhost' IDENTIFIED BY 'bs-admin';
CREATE USER 'bs-editor'@'localhost' IDENTIFIED BY 'bs-editor';
CREATE USER 'bs-validator'@'localhost' IDENTIFIED BY 'bs-validator';
CREATE USER 'bs-viewer'@'localhost' IDENTIFIED BY 'bs-viewer';

GRANT ALL PRIVILEGES ON cdc_manager.* TO 'bs'@'localhost';

-- Add all users' profiles privileges next

exit
