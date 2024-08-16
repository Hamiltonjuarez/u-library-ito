const jwt = require('jsonwebtoken')
import User from '../../models/User'
import { Request, Response, NextFunction } from "express"

module.exports = {
    auth: async (req: any, res: any, next: NextFunction) => {
        try {
            const { headers } = req
            const { authorization } = headers
            const token = authorization.split(' ')[1];

            if (!token) {
                throw new Error('access denied')
            }
            
            const decoded = jwt.verify(token, 'signed_token')
            const user = await User.findById(decoded.sub, '-password -__v')
            req.user = user
            req.token = token

            next()
        } catch (error) {
            res.status(401).send({ success: false })
        }
    },
    librarian: async (req: any, res: any, next: NextFunction) => {
        try {
            const { user } = req

            if (user.role === 'librarian') {
                req.user = user
                next()
            } else {
                throw new Error('access denied')
            }
        } catch (error) {
            res.status(401).send({ success: false })
        }
    }
}