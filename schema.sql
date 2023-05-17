-- DROP TABLE IF EXISTS favrecipe;
-- CREATE TABLE IF NOT EXISTS favrecipe(
-- id SERIAL PRIMARY KEY ,
-- title varchar(255),
-- readyinminutes varchar(255),
-- image varchar(255),
-- summary varchar(255)
-- );


DROP TABLE IF EXISTS memes;
CREATE TABLE IF NOT EXISTS memes (
    id SERIAL PRIMARY KEY,
    image_path VARCHAR(255),
    meme_name VARCHAR(255),
    rank INTEGER,
    tags VARCHAR(255),
    top_text VARCHAR(255)
);