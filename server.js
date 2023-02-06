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
  userEmail: String,
  privacy: String,
  groupID: {type: mongoose.Schema.ObjectId, ref: 'Group'},
});
//
mongoose.model('Note', Schema);
const Note = mongoose.model('Note');

const Group = mongoose.model('Group', {
  name: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
});

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

app.get('/getNotes', (req, res) => {
  console.log('Getting Notes');
  console.log('getNotes array: ' + req.body.ids);
  // Note.find({_ids: {$in: [req.body.ids]}})

  // Note.find({"_id" : {"$in" : [ObjectId("63c968a8c4afba376c71dae1"), ObjectId("63c740fee0dcd7e242a5e63a")]}})

  // Note.find({
  //   '_id': { $in: [
  //       mongoose.Types.ObjectId('63c968a8c4afba376c71dae1'),
  //       mongoose.Types.ObjectId('63c740fee0dcd7e242a5e63a'),
  //       // mongoose.Types.ObjectId('4ed3f18132f50c491100000e')
  //     ]}
  // Note.find( { _id : { $in : [mongoose.Types.ObjectId('63c73ece03e5b856270ab63b'),mongoose.Types.ObjectId('63c740fee0dcd7e242a5e63a')] } } )
  // Note.find( { _id : { $in : [mongoose.Types.ObjectId({$req.params.ids[0]}),mongoose.Types.ObjectId({req.body.ids[1]})] } } )

  Note.find({})
    .then(data => {
      console.log('data: ', data);
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/getModules', (req, res) => {
  console.log('Getting Module');
  Group.find({})
    .then(data => {
      console.log('data: ', data);
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/getNote', (req, res) => {
  console.log('Getting Note');
  Note.findById(req.body.id)
    .then(data => {
      console.log('data: ', data);
      console.log('name: ', data.name);
      console.log('content: ', data.content);
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});
//
app.post('/createNote', (req, res) => {
  console.log('Creating Note');
  const note = new Note({
    name: req.body.name,
    content: req.body.content,
    userEmail: req.body.userEmail,
    privacy: req.body.privacy,
    groupID: mongoose.Types.ObjectId(req.body.group),
  }); //
  note.save(function (err, note) {
    if (err) {
      return res.send(err);
    }
    Group.findById(req.body.groupID, function (err, group) {
      if (err) {
        return res.send(err);
      }
      group.notes.push(note);
      group.save(function (err) {
        if (err) {
          return res.send(err);
        }
        res.json(note);
      });
    });
  });
});

app.put('/updateNote', (req, res) => {
  Note.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    content: req.body.content,
  })
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => {
      console.log('error', err);
    });
});

app.post('/deleteNote', (req, res) => {
  console.log('Going to delete note with id:  ', req.body.id);
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
