var express = require('express');
var router = express.Router();
const Note = require("../models/note");
const withAuth = require("../middlewares/Auth")

router.post("/", withAuth, async (req, res) => { // When we call the withAuth, means that we can create a new note because we have a author
    const { title, body } = req.body;
    
    var note = new Note({title: title, body: body, author: req.user._id});
    console.log("id do user " + req.user._id)

    try {
        await note.save().catch(err => console.log("Error: ", err));
        res.status(200).json(note);
    } catch(error) {
        res.status(500).json({error: "Problem to create new note"})
    }
})

router.get("/:id", withAuth, async (req, res) => {
    try {
        const { id } = req.params;
        let note = await Note.findById(id);
        if(isOwner(req.user, note)){
            res.json(note);
        } else {
            res.status(403).json({error: "Permission denied: You cannot access this note"})
        }
    } catch (error) {
        res.status(500).json({error: "Problem to get a note"});
    }
})

router.get('/', withAuth, async (req, res) => {
    try {
        let note = await Note.find({author: req.user._id});
        res.json(note);
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.put('/:id', withAuth, async (req, res) => {
    const { title, body } = req.body;
    const { id } = req.params;

    try {
        let note = await Note.findById(id);
        if(isOwner(req.user, note)) {

            let note = await Note.findOneAndUpdate(id, 
                {$set: {title: title, body: body} }, //Update 
                { upsert: true, "new": true } // Make the return be the new note
                );
                res.json(note);
        } else {
            res.status(403).json({error: "Permission denied: You cannot access this note"})
        }
    } catch (error) {
        res.status(500).json({error: "Problem to update a note"});
    }

})

router.delete("/:id", withAuth, async (req, res) => {

    const { id } = req.params;
    try {
        let note = await Note.findById(id);
        if(isOwner(req.user, note)) {
            let note = await Note.findByIdAndRemove(id)
            res.json({message: "ok"}).status(204);
        } else {
            res.status(403).json({error: "Permission denied: You cannot access this note"})
        }
    } catch (error) {
        res.status(500).json({error: "Problem to delete a note"});
    }
    })

const isOwner = (user, note) => {
    if(JSON.stringify(user._id) == JSON.stringify(note.author._id)){
        return true;
    } else {
        return false;
    }
}

module.exports = router;