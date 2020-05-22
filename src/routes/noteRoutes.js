const express = require('express')
const fs = require('fs')
const noteRouter = express.Router();

noteRouter.route('/').get((req, res) => {
    res.render('notes');
  });
  
  noteRouter.route('/api')
    .post((req, res) => {
      const { text } = req.body;
      const { title } = req.body;
      const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
      const savedNotes = [...notes, { id: notes.length + 1, title, text }];
      fs.writeFile('db.json', JSON.stringify(savedNotes, null, 2), (err) => { if (err) throw err; console.log('saved!'); });
      res.json(savedNotes);
    })
    .get((req, res) => {
      const notes = fs.readFileSync('db.json', 'utf8');
      res.json(JSON.parse(notes));
    });
  
  noteRouter.route('/api/:id')
    .delete((req, res) => {
      const id = Number(req.params.id);
      const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
      const savedNotes = notes.filter((note) => note.id !== id);
      fs.writeFile('db.json', JSON.stringify(savedNotes, null, 2), (err) => { if (err) throw err; console.log('saved!'); });
      res.json(savedNotes);
    });
  
    module.exports = noteRouter;