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
    username VARCHAR(255) NOT NULL,
    startedDateTime VARCHAR(255) NOT NULL,
    serverIPAddress VARCHAR(255) NOT NULL,
    timings INT NOT NULL,
    PRIMARY KEY(username, startedDateTime),
    FOREIGN KEY(username) REFERENCES User(username)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Request
(
    entry_id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    method ENUM('GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH') NOT NULL,
    host VARCHAR(255) NOT NULL,
    pragma VARCHAR(255),
    cache_control VARCHAR(255),
    FOREIGN KEY(entry_id) REFERENCES Entry(entry_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Response
(
    entry_id INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    statusText VARCHAR(255),
    cache_control VARCHAR(255),
    pragma VARCHAR(255),
    age VARCHAR(255),
    last_modified VARCHAR(255),
    content_type VARCHAR(255),
    expires VARCHAR(255),
    FOREIGN KEY(entry_id) REFERENCES Entry(entry_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
