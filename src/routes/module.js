const express = require('express')
const router = new express.Router()
const Module = require('../models/module')
const auth = require('../middleware/auth')
router.post('/addModule', auth, async (req, res) => {
    // const tasks = new Task(req.body);
    const module = new Module({
        ...req.body,
        createdBy: req.user._id
    })
    try {
        await module.save()
        res.status(201).send(module)
    } catch (error) {
        res.status(500).send(error)
    }
    // tasks.save().then(() => { res.status(201).send(req.body) }).catch(err => { res.status(400).send(err) })
})

router.get('/getModule', auth, async (req, res) => {

    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        // const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'modules',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.modules)
    } catch (error) {
        res.send(500).send(error)
    }
})

router.get('/module/:id', auth, async (req, res) => {
    const taskId = req.params.id
    try {
        // const task = await Task.findById(taskId)
        const module = await Module.findOne({ _id: taskId, owner: req.user._id })
        if (!module) {
            res.status(404).send()
        }
        res.send(module)
    } catch (error) {
        res.status(500).send()

    }
    // Task.findById(taskId).then(task => {
    //     if(!task){
    //         res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch(err => {
    //     res.status(500).send(err)
    // })
})

router.patch('/modules/:id', auth, async (req, res) => {
    const id = req.params.id
    const upadtes = Object.keys(req.body)
    const allowedUpdates = ['name']
    const isValidOpretor = upadtes.every((update) => allowedUpdates.includes(update))
    if (!isValidOpretor) {
        return res.status(404).send({ "error": "invalid poperty update" })
    }
    try {
        // const tasks= await Task.findByIdAndUpdate(id,req.body,{new:true,runValidators:true})
        const module = await Module.findOne({ _id: id, createdBy: req.user._id })

        if (!module) {
            return res.status(404).send()
        }
        upadtes.forEach(update => module[update] = req.body[update])
        await module.save()

        res.send(module)
    } catch (error) {
        res.status(500).send()
    }
});
router.delete('/modules/:id', auth, async (req, res) => {
    const id = req.params.id
    try {

        const module = await Module.findOneAndDelete({ _id: id, createdBy: req.user._id })

        if (!module) {
            res.status(404).send()
        }

        res.send(module)
    } catch (error) {
        res.status(500).send()
    }
})
module.exports = router