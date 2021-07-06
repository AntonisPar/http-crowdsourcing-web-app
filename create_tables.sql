CREATE TABLE IF NOT EXISTS User
(
    username VARCHAR(255) NOT NULL DEFAULT 'unknown',
    e_mail VARCHAR(255) NOT NULL DEFAULT 'unknown',
    passwd VARCHAR(255) NOT NULL,
    isAdmin TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY(username)
);

CREATE TABLE IF NOT EXISTS Entry
(
    entryId INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    startedDateTime VARCHAR(255) NOT NULL,
    serverIPAddress VARCHAR(255),
    wait INT,
    url VARCHAR(2083) NOT NULL,
    method ENUM('GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH') NOT NULL,
    hostRequest VARCHAR(255) ,
    pragmaRequest VARCHAR(255),
    `cache-controlRequest` VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    statusText VARCHAR(255),
    `cache-controlResponse` VARCHAR(255),
    pragmaResponse VARCHAR(255),
    age VARCHAR(255),
    `last-modifiedResponse` VARCHAR(255),
    `content-typeResponse` VARCHAR(255),
    expiresResponse VARCHAR(255),
    PRIMARY KEY(entryId, username),
    CONSTRAINT USRENTRY FOREIGN KEY(username) REFERENCES User(username)
    ON DELETE CASCADE ON UPDATE CASCADE
);
