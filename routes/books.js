const express = require('express');
const BooksController = require('../controllers/BooksController');
const fileMiddleware = require('../middleware/file');
const router = express.Router();

router.get('/books', BooksController.getBooks); // роут для получения всех книг
router.get('/books/:id', BooksController.getBook); // роут для получения книги по id
router.post('/books', BooksController.createBook); // роут для создания книги
router.put('/books/:id', fileMiddleware.single('filebook'), BooksController.updateBook); // роут для редактирования книги
router.delete('/books/:id', BooksController.deleteBook); // роут для удаления книги
router.post('/books/:id/upload', fileMiddleware.single('filebook'), BooksController.uploadCover); // роут для закачки файла книги
router.get('/books/:id/download', BooksController.downloadCover); // роут для скачивания обложки книги



module.exports = router;
