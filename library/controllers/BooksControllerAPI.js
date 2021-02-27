const Book = require('../models/Book');
const store = require('../store/store');
const path = require('path');

class BooksController {
  async getBooks(req, res) {
    const data = await store.readFromDB();
    res.status(200).json({
      success: true,
      quantity: data.length,
      data,
    });
  }

  async getBook(req, res) {
    const { id } = req.params;
    const db = await store.readFromDB();
    const book = db.find((item) => item.id === id);
    if (book) {
      res.status(200).json({
        success: true,
        data: book,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
  }

  async createBook(req, res) {
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    const book = new Book(title, description, authors, favorite, fileCover, fileName);
    await store.writeInDB(book);
    res.status(201).json({
      success: true,
      data: book,
    });
  }

  async updateBook(req, res) {
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    const { id } = req.params;
    const db = await store.readFromDB();
    const updateBookIndex = db.findIndex((item) => item.id === id);
    if (updateBookIndex !== -1) {
      const updateBook = {
        id: db[updateBookIndex].id,
        title: title ? title : db[updateBookIndex].title,
        description: description ? description : db[updateBookIndex].description,
        authors: authors ? authors : db[updateBookIndex].authors,
        favorite: favorite ? favorite : db[updateBookIndex].favorite,
        fileCover: fileCover ? fileCover : db[updateBookIndex].fileCover,
        fileName: fileName ? fileName : db[updateBookIndex].fileName,
        fileBook: req.file ? req.file.path : db[updateBookIndex].fileBook,
      };
      db.splice(updateBookIndex, 1);
      store.writeInDB(updateBook);
      res.status(200).json({
        success: true,
        data: updateBook,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
  }

  async deleteBook(req, res) {
    const { id } = req.params;
    const db = await store.readFromDB();
    const deleteBookIndex = db.findIndex((item) => item.id === id);
    if (deleteBookIndex !== -1) {
      db.splice(deleteBookIndex, 1);
      store.deleteFromDB(db);
      res.status(200).json({
        success: true,
      });
      // store.writeDB();
    } else {
      res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
  }

  async uploadCover(req, res) {
    const { id } = req.params;
    const db = await store.readFromDB();
    const findBookIndex = db.findIndex((item) => item.id === id);
    if (findBookIndex !== -1) {
      if (req.file) {
        const { path } = req.file;
        const updateBook = {
          ...db[findBookIndex],
          fileBook: path,
        };
        db.splice(findBookIndex, 1);
        store.writeInDB(updateBook);
        res.status(200).json({
          success: true,
          path,
        });
      } else {
        res.json({
          success: false,
          path: null,
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
  }

  async downloadCover(req, res) {
    const { id } = req.params;
    const db = await store.readFromDB();
    const book = db.find((item) => item.id === id);
    if (book) {
      res.download(book.fileBook, `${book.title}${path.extname(book.fileBook)}`, (err) => {
        if (err) {
          res.status(404).json();
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }
  }
}

module.exports = new BooksController();
