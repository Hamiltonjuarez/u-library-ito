import { Router } from 'express';
const router = Router();

const middlewares = require('./middlewares/middlewares')
const handler = require('../handlers/auth')

router.post('/register', handler.register)
router.post('/login', handler.login)

module.exports = router;