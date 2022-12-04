// create an express app
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

// use the express-static middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const Schema = new mongoose.Schema({
  name: String,
  content: String,
});

mongoose.model('note', Schema);
const Note = mongoose.model('note');

mongoose.connect(
  'mongodb+srv://admin:adminpw@cluster0.p8vqsyf.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);
mongoose.connection.on('connected', () => {
  console.log('Connected');
});
mongoose.connection.on('error', err => {
  console.log('error', err);
});

app.get('/', (req, res) => {
  console.log('Getting Users');
  Note.find({})
    .then(data => {
      console.log('data: ', data);
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/createNote', (req, res) => {
  console.log('Creating Note');
  const note = new Note({
    name: req.body.name,
    content: req.body.content,
  });
  note
    .save()
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => {
      console.log('error', err);
    });
});

app.delete('/deleteNote', (req, res) => {
  console.log('Going to delete');
  Note.findByIdAndRemove(req.body.id)
    .then(data => {
      console.log('data ', data);
      res.send(data);
    })
    .catch(err => {
      console.log('error', err);
    });
});

// start the server listening for requests
app.listen(process.env.PORT || 3000, () => console.log('Server is running...'));
