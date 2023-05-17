-- DROP TABLE IF EXISTS favrecipe;
-- CREATE TABLE IF NOT EXISTS favrecipe(
-- id SERIAL PRIMARY KEY ,
-- title varchar(255),
-- readyinminutes varchar(255),
-- image varchar(255),
-- summary varchar(255)
-- );


-- the database im in now(demo15) didnt work at first and gave me errors in the terminal telling me that there is no meme relation so i went to demo15 in psql and add table meme
DROP TABLE IF EXISTS memes;
CREATE TABLE IF NOT EXISTS memes (
    id SERIAL PRIMARY KEY,
    image_path VARCHAR(255),
    meme_name VARCHAR(255),
    rank INTEGER,
    tags VARCHAR(255),
    top_text VARCHAR(255)
);