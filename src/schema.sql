CREATE TABLE IF NOT EXISTS users (
    user_name TEXT PRIMARY KEY,
    password  TEXT NOT NULL
);

insert or replace into users(user_name, password) values("user1", "password1");
insert or replace into users(user_name, password) values("user2", "password2");
