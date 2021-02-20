const express = require('express');
const BooksController = require('../controllers/BooksController');
const fileMiddleware = require('../middleware/file');
const router = express.Router();

router.get('/', BooksController.getBooks) // роут для получения всех книг
router.get('/books/view/:id', BooksController.getBook); // роут для получения книги по id
router.get('/books/create', BooksController.createBookGet); // роут для создания книги
router.post('/books/create', fileMiddleware.single('filebook'), BooksController.createBookPost); // роут для создания книги post
router.get('/books/update/:id', BooksController.updateBookGet); // роут для редактирования книги get
router.post('/books/update/:id', fileMiddleware.single('filebook'), BooksController.updateBookPost); // роут для редактирования книги post
router.post('/books/delete/:id', BooksController.deleteBook); // роут для удаления книги

module.exports = router;
