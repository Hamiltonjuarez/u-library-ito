import { Router } from 'express';
const router = Router();

const middlewares = require('./middlewares/middlewares')
const authHandler = require('../handlers/auth')
const bookHandler = require('../handlers/book')

//auth routes
router.post('/register', [middlewares.auth, middlewares.librarian], authHandler.register)
router.post('/login', authHandler.login)

//book routes
router.get('/books', [middlewares.auth], bookHandler.getUserBooks)
router.post('/books', [middlewares.auth, middlewares.librarian], bookHandler.addNewBook)
router.get('/books/:bookId', [middlewares.auth], bookHandler.showBook)
router.post('/books/checkout/:bookId', [middlewares.auth], bookHandler.checkoutBook)
router.post('/books/return/:bookId', [middlewares.auth, middlewares.librarian], bookHandler.returnBook)

module.exports = router;