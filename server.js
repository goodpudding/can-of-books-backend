"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Book = require("./models/book.js");

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

async function getBooks(req, res, next) {
  try {
    let results = await Book.find({});
    res.status(200).send(results);
  } catch (err) {
    next(err);
  }
}

async function postBooks(req, res, next) {
  try {
    let createdBook = await Book.create(req.body);
    res.status(200).send(createdBook);
  } catch (err) {
    next(err);
  }
}

async function deleteBooks(req, res, next) {
  try {
    let id = req.params.id;
    await Book.findByIdAndDelete(id);
    res.status(200).send(id);
  } catch (err) {
    next(err);
  }
}


app.get("/test", (request, response) => {
  response.send("test request received");
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
