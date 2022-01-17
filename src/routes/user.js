const express = require('express')

const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - age
 *         - password
 *    
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         age:
 *           type: int
 *           description: The age of the user
 *     
 */

/**
 * @swagger
 * 
 * /users:
 *  post:
 *      tags: [Sign Up]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name: 
 *                             type: string
 *                          email:
 *                              type: string
 *                              default: coder@example.com
 *                          password:
 *                              type: string
 *                              default: coder123
 *                          age:
 *                              type: number
 *      responses:
 *          default:
 *              description: This is the default response for it
 */
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    // user.save().then(() => { res.status(201).send(user) }).catch(err => {
    //     res.status(400).send(err)
    // })
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }


})
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)

})

router.patch('/users/me', auth, async (req, res) => {
    const upadtes = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOpretor = upadtes.every((update) => allowedUpdates.includes(update))
    if (!isValidOpretor) {
        return res.status(404).send({ "error": "invalid poperty update" })
    }
    console.log(req.user)
    try {
        // const user= await User.findByIdAndUpdate(id,req.body,{new:true,runValidators:true})
        // const user = await req.user

        upadtes.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        if (!req.user) {
            return res.status(404).send()
        }
        res.status(200).send(req.user)
    } catch (error) {
        res.status(400).send()
    }
})
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})
/**
 * @swagger

 * /users/login:
 *  post:
 *      tags: [login]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              default: coder
 *                          password:
 *                              type: string
 *                              default: coder123
 *      responses:
 *          default:
 *              description: This is the default response for it
 */
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        console.log(token, user)
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})
module.exports = router