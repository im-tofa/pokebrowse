/* run these if you want to delete tables and re-create them */
DROP TABLE Ratings CASCADE;
DROP TABLE Users CASCADE;
DROP TABLE Sets CASCADE;

/* run these if you want to create new tables */
CREATE TABLE IF NOT EXISTS Users (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_name VARCHAR(32) UNIQUE NOT NULL, /* 32 characters at most */
    user_pw CHAR(60) NOT NULL, /* store bcrypt hash */
    user_token_version INT NOT NULL DEFAULT 0,
    user_created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_last_login TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Sets (
    set_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    author VARCHAR(32),
    species VARCHAR(64) NOT NULL,
    level SMALLINT NOT NULL DEFAULT 100,
    nature VARCHAR(16) NOT NULL,
    item VARCHAR(16),
    ability VARCHAR(64) NOT NULL,
    moves VARCHAR(64)[] NOT NULL,
    evs JSON,
    ivs JSON, 
    speed SMALLINT NOT NULL,
    set_uploaded_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (author) REFERENCES Users(user_name) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Ratings (
    user_id INT NOT NULL,
    set_id INT NOT NULL,
    rating SMALLINT NOT NULL,
    PRIMARY KEY (user_id, set_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (set_id) REFERENCES Sets(set_id) ON DELETE CASCADE
);