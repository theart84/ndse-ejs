const express = require('express');
const BooksControllerAPI = require('../controllers/BooksControllerAPI');
const fileMiddleware = require('../middleware/file');
const router = express.Router();

router.get('/books', BooksControllerAPI.getBooks); // роут для получения всех книг
router.get('/books/:id', BooksControllerAPI.getBook); // роут для получения книги по id
router.post('/books', BooksControllerAPI.createBook); // роут для создания книги
router.put('/books/:id', fileMiddleware.single('filebook'), BooksControllerAPI.updateBook); // роут для редактирования книги
router.delete('/books/:id', BooksControllerAPI.deleteBook); // роут для удаления книги
router.post('/books_/:id/upload', fileMiddleware.single('filebook'), BooksControllerAPI.uploadCover); // роут для закачки файла книги
router.get('/books/:id/download', BooksControllerAPI.downloadCover); // роут для скачивания обложки книги

module.exports = router;
