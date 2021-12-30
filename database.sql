CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CREATE DATABASE Poker;

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL
);
