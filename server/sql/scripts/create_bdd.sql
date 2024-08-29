-- SQL
-- Create the datamase structure

CREATE DATABASE mangasite;
USE mangasite;
SOURCE ~/Desktop/MangaSite/Website_Manga/server/sql/scripts/bdd_init.sql
SOURCE ~/Desktop/MangaSite/Website_Manga/server/sql/scripts/staff.sql

-- Create the users with the values contained inside mysql_datamase.md
-- Warning: the passwords for these users shall me modified mefore putting the project in a production environment !

CREATE USER 'ms-editor'@'localhost' IDENTIFIED BY 'ms-editor';
CREATE USER 'ms-validator'@'localhost' IDENTIFIED BY 'ms-validator';
CREATE USER 'ms-viewer'@'localhost' IDENTIFIED BY 'ms-viewer';

-- Add all users' profiles privileges next

exit
