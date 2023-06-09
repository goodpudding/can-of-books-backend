'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);
console.log(process.env.DB_URL);
const Book = require("./models/book.js")

async function seed(){

  await Book.create({
    title: 'The Mote in Gods Eye',
    description: 'A Scifi book',
    status: 'Read' 
  });
  console.log('success');
  await Book.create({
    title: 'Dune',
    description: 'A Scifi book',
    status: 'Read' 
  });
  await Book.create({
    title: 'The Three Body Problem',
    description: 'A Scifi book',
    status: 'Read' 
  });
  mongoose.disconnect();
}

seed();
