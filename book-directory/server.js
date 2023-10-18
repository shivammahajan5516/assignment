const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number,
});

const Book = mongoose.model('Book', BookSchema);

// GET - Retrieve all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error('Error retrieving books:', err);
    res.status(500).send('Internal Server Error');
  }
});

// POST - Add a new book
app.post('/books', async (req, res) => {
  const newBook = req.body;

  try {
    const book = await Book.create(newBook);
    res.status(201).json(book);
  } catch (err) {
    console.error('Error adding a book:', err);
    res.status(500).send('Internal Server Error');
  }
});

// PUT - Update an existing book
app.put('/books/:id', async (req, res) => {
  const bookId = req.params.id;
  const updatedBook = req.body;

  try {
    const book = await Book.findByIdAndUpdate(bookId, updatedBook, { new: true });
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.json(book);
    }
  } catch (err) {
    console.error('Error updating a book:', err);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE - Remove a book
app.delete('/books/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findByIdAndRemove(bookId);
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
    } else {
      res.json(book);
    }
  } catch (err) {
    console.error('Error deleting a book:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
