'use strict';
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");
// const server = express();
// const pg = require("pg");
// const client = new pg.Client(process.env.DATABASE_URL);
// server.use(cors());
// server.use(express.json());//to allow the server to read req.body
// const foodKey = process.env.API_KEY;
// const port = process.env.PORT;
// const recipesData = require('./data.json');
// function Recipe(id, title, time, image, summary) {
//     this.id = id;
//     this.title = title;
//     this.time = time;
//     this.image = image;
//     this.summary = summary;
// }
// // routes
// server.get("/", handleHome);
// server.get("/recipes", handleRecipes);
// server.get("/ingredients", handleIngredients);
// server.get("/favrecipes", getFavRecipesHandler);
// server.post("/favrecipes", addFavRecipesHandler);
// server.delete("/favrecipes/:id", deleteFavRecipesHandler);
// server.put("/favrecipes/:id", updateFavRecipesHandler);

// // handlers
// function updateFavRecipesHandler(req, res) {
//     const id = req.params.id;
//     const sql = `update favrecipe set title=$1,readyinminutes=$2,image=$3,summary=$4 where id=${id} returning *;`
//     const values = [req.body.title, req.body.readyinminutes, req.body.image, req.body.summary]; // we got the names from the table(schema.sql)
//     client.query(sql, values)
//         .then((data) => {
//             res.status(200).send(data.rows);
//         })
// }


// function deleteFavRecipesHandler(req, res) {
//     // http://localhost:3000/favrecipe/2 we test this link in thc not in chrome because the default method of chrome is get method and we need the delete method
//     const recipeId = req.params.id;
//     // console.log(recipeId) //return the id value we put in the link
//     const sql = `delete from favrecipe where id = ${recipeId};`
//     client.query(sql)
//         .then((data) => {
//             // if(data)
//             res.status(202).send('deleted');
//             // res.status(204).json({})
//             // else
//             // res.status(404).json({ error: `item not found` })
//         })

// }



// function addFavRecipesHandler(req, res) {
//     const recipe = req.body;
//     // {
//     //     "title":"koftah",
//     //     "readyinminutes":"120",
//     //     "image":"https://www.example.com/spaghetti-bolognese.jpg",
//     //     "summary":"step123"
//     // }
//     // console.log(recipe);
//     // const sql = `INSERT into favrecipe (title,readyinminutes,image,summary) values ('${recipe.title}','${recipe.readyinminutes}','${recipe.image}','${recipe.summary}');`;
//     const sql = `INSERT into favrecipe (title,readyinminutes,image,summary) values ($1,$2,$3,$4) RETURNING *;`;
//     const values = [recipe.title, recipe.readyinminutes, recipe.image, recipe.summary];

//     client.query(sql, values).then((data) => {
//         res.status(201).send(data.rows);
//         // res.send('added successfully');
//     })
// }
// function getFavRecipesHandler(req, res) {
//     const sql = 'select * from favrecipe;';
//     // const sql = 'select title from favrecipe;';
//     client.query(sql)
//         .then((data) => {
//             // res.send(data.rows);
//             let dataFromDB = data.rows.map((item) => {
//                 let singleRecipe = new Recipe(
//                     item.id,
//                     item.title,
//                     item.readyinminutes,
//                     item.image,
//                     item.summary
//                 )
//                 return singleRecipe;
//             });
//             res.status(200).send(dataFromDB);
//         })
// }
// function handleHome(req, res) {
//     res.status(200).send("welcome home ");
// }
// async function handleRecipes(req, res) {
//     // let recipes = recipesData.data.map((item) => {
//     //     return new Recipe(item.title, item.readyInMinutes, item.image, item.summary);
//     // })
//     const url = `https://api.spoonacular.com/recipes/random?apiKey=${foodKey}&number=4`;

//     let recipesFromAPI = await axios.get(url);
//     console.log("without .data ", recipesFromAPI);
//     console.log("with .data", recipesFromAPI.data);
//     let recipes = recipesFromAPI.data.recipes.map((item) => {
//         return new Recipe(item.title, item.readyInMinutes, item.image, item.summary);
//     })
//     res.send(recipes);
// }
// function handleIngredients(req, res) {
//     //the query from the frontend
//     let searchByIngredients = req.query.ingredients;
//     const url = `https://api.soopnacular.com/recipes/findByIngredients?apiKey=${foodKey}&ingredients=${searchByIngredients}`;
//     axios.get(url)
//         .then((result) => {
//             console.log(result.data);
//             res.send(result.data)
//         })
//         .catch((error) => {
//             res.status(500).send(error, "error");
//         });
// }
// client.connect().then(() => {
//     server.listen(port, () => {
//         console.log('ready and listen on port', port);
//     });
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');
const jsonData = require('./data.json')
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL);
app.get('/', helloWorldHandler);
app.get('/allMemes', getAllMemesHandler);//will send data from json file
app.post('/addFavMeme', addFavMemeHandler); // will add a favirote meme to the database
app.get('/favMeme', getfavMemeHandler);//read from database
app.get('/favMeme/:id', getOneFavMemeHandler);
app.put('/updatefavMeme/:id', updatefavMemeHandler);
app.delete('/deleteFavMeme/:id', deleteFavMemeHandler);
app.use('*', notFoundHandler);
app.use(errorHandler)
function helloWorldHandler(req, res) {
    return res.status(200).send("Hello World");
}
function getAllMemesHandler(req, res) {
    console.log("your req was sent !")
    res.send(jsonData);
}
function addFavMemeHandler(req, res) {
    const meme = req.body;
    const sql = `INSERT INTO memes(image_path, meme_name, rank, tags, top_text) VALUES($1, $2, $3, $4, $5) RETURNING *;`
    const values = [meme.image_path, meme.meme_name, meme.rank, meme.tags, meme.top_text];
    client.query(sql, values).then((data) => {
        res.status(201).json(data.rows);


    })
        .catch(error => {
            console.log(error);
            errorHandler(error, req, res);
        });
};
function getfavMemeHandler(req, res) {
    const sql = `SELECT * FROM memes;`;
    client.query(sql).then(data => {
        res.status(200).send(data.rows);
    })
        .catch(error => {
            errorHandler(error, req, res);
        });
};
function getOneFavMemeHandler(req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM memes WHERE id = ${id};`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
    })
        .catch(error => {
            errorHandler(error, req, res);
        });
};
function updatefavMemeHandler(req, res) {
    const id = req.params.id;
    const meme = req.body;
    const sql = `UPDATE memes SET image_path=$1, meme_name=$2, rank=$3, tags=$4, top_text=$5 WHERE id=${id} RETURNING *;`;
    const values = [meme.image_path, meme.meme_name, meme.rank, meme.tags, meme.top_text];
    client.query(sql, values).then((data) => {
        // res.status(200).json(data.rows);
        //go to local host(http://localhost:5000/favMeme) hit refrsh it will be updated in the database 
       
        // to get the data from db to the front end after updating them we need to get back the updated data so we use get command below, if not for it it will just get back the updated data of the modal only and the rest of the favlist wont appear thats why we need to select all the data from db,  comment the get command below and try update one of the modal data in react you will see just the updated modal and wont see the rest of modals,
        

        //get command:
        const newSql=`select * from memes`;
        client.query(newSql).then(data=>{

            res.status(200).json(data.rows);
        })
        // or you can send 204 status with no content
        // return res.status(200).json(data.rows);
    }).catch(err => {
        console.log(err);
        errorHandler(err, req, res);
    });

};
function deleteFavMemeHandler(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM memes WHERE id=${id};`;
    client.query(sql).then(() => {
        res.status(204).json({});
    })
        .catch(err => {
            errorHandler(err, req, res);
        })
};
function notFoundHandler(request, response) {
    response.status(404).send('not found');
}
function errorHandler(error, req, res) {
    const err = {
        status: 500,
        message: error
    }
    res.status(500).send(err);
};
client.connect()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`listening on ${PORT}`)
        );
    });