import { Router } from 'express';
const router = Router();
const handler = require('../handlers/auth')

router.post('/login', handler.login)

module.exports = router;