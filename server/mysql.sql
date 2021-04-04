-- create or drop database
DROP DATABASE if exists mygame;
CREATE DATABASE mygame;
-- create user mysql
CREATE USER 'user' @'localhost' identified by '123456';
DROP USER 'user' @'localhost';
-- allow user to access mygame
GRANT ALL PRIVILEGES ON mygame.* TO 'user' @'localhost';