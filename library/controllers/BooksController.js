const Book = require('../models/Book');
const store = require('../store/store');

const { updateCounter, readCounter } = require('../helpers/utils');

class BooksController {
  async getBooks(req, res) {
    const data = await store.readFromDB();
    const injectCounterInData = await Promise.all(data.map(async (book) => ({ ...book, counter: await readCounter(book.id)})));
    res.render('index', {
      title: 'Главная',
      books: injectCounterInData,
    });
  }

  async getBook(req, res) {
    const { id } = req.params;
    const db = await store.readFromDB();
    const book = db.find((item) => item.id === id);
    const counter = await updateCounter(id);
    if (book) {
      res.render('view', {
        title: 'Главная',
        book: {
          ...book,
          counter 
        }
      });
    } else {
      res.status(404).redirect('error/404');
    }
  }

  createBookGet(req, res) {
    res.render('create', {
      title: 'Главная',
      book: [],
    });
  }

  async createBookPost(req, res) {
    const db = await store.readFromDB();
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    let fileBook = '';
    if (req.file) {
      fileBook = req.file.path;
    }
    const book = new Book(title, description, authors, favorite, fileCover, fileName, fileBook);
    // let fixedPathFile = fileBook.replace(/undefined/, book.id)
    // console.log(fixedPathFile);
    await store.writeInDB(book);
    res.render('index', {
      title: 'Главная',
      books: db,
    });
  }

  async updateBookGet(req, res) {
    const { title, description, authors, favorite, fileCover, fileName } = req.body;
    const { id } = req.params;
    const db = await store.readFromDB();
    const updateBookIndex = db.findIndex((item) => item.id === id);
    if (updateBookIndex !== -1) {
      res.render('update', {
        title: db[updateBookIndex].title,
        book: db[updateBookIndex],
      });
    } else {
      res.status(404).redirect('error/404');
    }
  }

  async updateBookPost(req, res) {
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
      res.render('view', {
        title: 'Главная',
        book: db[db.findIndex((item) => item.id === id)],
      });
    } else {
      res.status(404).redirect('error/404');
    }
  }

  async deleteBook(req, res) {
    const { id } = req.params;
    const db = await store.readFromDB();
    const deleteBookIndex = db.findIndex((item) => item.id === id);
    if (deleteBookIndex !== -1) {
      db.splice(deleteBookIndex, 1);
      store.deleteFromDB(db);
      res.render('index', {
        title: 'Главная',
        books: db,
      });
    } else {
      res.status(404).redirect('error/404');
    }
  }

  // async uploadCover(req, res) {
  //   const { id } = req.params;
  //   const db = await store.readFromDB();
  //   const findBookIndex = db.findIndex((item) => item.id === id);
  //   if (findBookIndex !== -1) {
  //     if (req.file) {
  //       const { path } = req.file;
  //       const updateBook = {
  //         ...db[findBookIndex],
  //         fileBook: path,
  //       };
  //       db.splice(findBookIndex, 1);
  //       store.writeInDB(updateBook);
  //       res.status(200).json({
  //         success: true,
  //         path,
  //       });
  //     } else {
  //       res.json({
  //         success: false,
  //         path: null,
  //       });
  //     }
  //   } else {
  //     res.status(404).json({
  //       success: false,
  //       message: 'Book not found',
  //     });
  //   }
  // }

  // async downloadCover(req, res) {
  //   const { id } = req.params;
  //   const db = await store.readFromDB();
  //   const book = db.find((item) => item.id === id);
  //   if (book) {
  //     res.download(book.fileBook, `${book.title}${path.extname(book.fileBook)}`, (err) => {
  //       if (err) {
  //         res.status(404).json();
  //       }
  //     });
  //   } else {
  //     res.status(404).json({
  //       success: false,
  //       message: 'Book not found',
  //     });
  //   }
  // }
}

module.exports = new BooksController();
