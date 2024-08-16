const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
import User, { IUser } from '../models/User';
import { Request, Response } from 'express';

const signToken = (id: string, remember: boolean) => {
    const obj = { sub: id, exp: 0 }
    if (!remember) {
        obj.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 2
    }
    return JWT.sign(obj, 'signed_token')
}

const updateLastLoginDate = async (user: IUser) => {
    try {
        const { id } = user
        await User.findByIdAndUpdate(id, { lastLoginDate: Date.now() })
    } catch (error) {
        console.error('updateLastLoginDate error')
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { email, password, remember } = req.body

        let user = await User.findOne({ email })

        if (!user) {
            throw new Error()
        }


        const isMatch = await user.isValidPassword(password)

        if (!isMatch) {
            throw new Error()
        }

        const token = signToken(user.id, remember)
        updateLastLoginDate(user)

        res.send({ user, token })
    } catch (error) {
        res.status(401).send({ success: false, error })
    }
}

const register = async (req: Request, res: Response) => {
    try {
        const { email, password, confirmPassword, phone = '', role, firstName, lastName } = req.body

        const existingUser = await User.findOne({email})

        if (existingUser) {
            throw new Error('ALREADY_EXIST')
        }

        if (password !== confirmPassword) {
            throw new Error('PASSWORD_CONFIRM')
        }

        if (password.length < 5) {
            throw new Error('SHORT_PASSWORD')
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)
        const newUser = new User({email, password: passwordHash, phone, role, firstName, lastName })
        await newUser.save()
        const token = signToken(newUser.id, true)

        res.send({ success: true, newUser, token })
    } catch (error: any) {
        res.status(401).send({ success: false, error: error.message })
    }
}


module.exports = {
    login,
    register,
}