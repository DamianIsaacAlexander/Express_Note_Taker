const express = require('express');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const noteRouter = express.Router();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/css', express.static(path.join(__dirname, '/public/css')));
app.use('/js', express.static(path.join(__dirname, '/public/js')));
app.set('views', path.join(__dirname, 'views/src'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

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

app.use('/notes', noteRouter);

app.listen(port, () => {
  console.log(`server is running on ${chalk.green(port)}`);
});
