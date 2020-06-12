CREATE TABLE IF NOT EXISTS users (
    user_name TEXT PRIMARY KEY,
    password  TEXT NOT NULL,
    score     INT  NOT NULL
                   DEFAULT (0)
);

insert or replace into users(user_name, password, score) values("user1", "password1", 0);
insert or replace into users(user_name, password, score) values("user2", "password2", 0);
