"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Book = require("./models/book.js");
const verifyUser = require("./auth");

// add validation to confirm we are wired up to our mongo DB
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Mongoose is connected");
});

mongoose.connect(process.env.DB_URL);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get("/books", getBooks);
app.post("/books", postBooks);
app.delete("/books/:id", deleteBooks);
app.put("/books/:id", putBooks);

async function getBooks(req, res, next) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send("invalid token");
    } else {
      try {
        let results = await Book.find({});
        res.status(200).send(results);
        console.log("we got books");
      } catch (err) {
        next(err);
      }
    }
  });
}

async function postBooks(req, res, next) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send("invalid token");
    } else {
      try {
        let createdBook = await Book.create(req.body);
        res.status(200).send(createdBook);
      } catch (err) {
        next(err);
      }
    }
  });
}

async function deleteBooks(req, res, next) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send("invalid token");
    } else {
      try {
        let id = req.params.id;
        await Book.findByIdAndDelete(id);
        res.status(200).send(id);
      } catch (err) {
        next(err);
      }
    }
  });
}
async function putBooks(req, res, next) {
  verifyUser(req, async (err, user) => {
    if (err) {
      console.error(err);
      res.send("invalid token");
    } else {
      try {
        let id = req.params.id;
        let updatedBook = req.body;
        let updatedBookFromDB = await Book.findByIdAndUpdate(id, updatedBook, {
          new: true,
          overwrite: true,
        });
        res.status(200).send(updatedBookFromDB);
      } catch (err) {
        next(err);
      }
    }
  });
}

app.get("/test", (request, response) => {
  response.send("test request received");
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
