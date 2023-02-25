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
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
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

const User = mongoose.model('User', {
  email: String,
  Groups: [
    {
      Rooms: [{Room_name: String}],
      Group_name: String,
    },
  ],
});

const Comment = mongoose.model('Comment', {
  content: String,
  userEmail: String,
  noteID: mongoose.Schema.Types.ObjectId,
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

app.get('/getUser', (req, res) => {
  console.log('Getting User');
  User.find({})
    .then(data => {
      console.log('data: ' + data);
      console.log('Groups: ' + data[0].Groups);
      console.log('rooms: ' + data[0].Groups[0].Rooms);
      // console.log('rooms2: ' + data.Groups[0]);
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/getOneComment', (req, res) => {
  console.log('Id to find, using req.body: ' + req.body.id);
  console.log('Id to find, using req.params: ' + req.params.id);
  console.log('Id to find, using req.query: ' + req.query.id);
  console.log('Id to find, using req.body and cast: ' + mongoose.Types.ObjectId(req.body.id));
  console.log('Id to find, using req.params and cast: ' + mongoose.Types.ObjectId(req.params.id));
  console.log('Id to find, using req.query and cast: ' + mongoose.Types.ObjectId(req.query.id));
  Comment.find({_id: req.body.id})
    .then(data => {
      console.log('data: ' + data);
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/getComment', (req, res) => {
  console.log('Getting Comment');
  let id = req.body.id;
  console.log('Id to find is: ' + id);
  console.log('Id to find, using req.body: ' + req.body.id);
  console.log('Id to find, using req.params: ' + req.params.id);
  console.log('Id to find, using req.query: ' + req.query.id);
  console.log('Id to find, using req.body and cast: ' + mongoose.Types.ObjectId(req.body.id));
  console.log('Id to find, using req.params and cast: ' + mongoose.Types.ObjectId(req.params.id));
  console.log('Id to find, using req.query and cast: ' + mongoose.Types.ObjectId(req.query.id));
  Comment.findById(id, function (err, comment) {
    if(err){
      console.log(err);
    } else {
      console.log('comment: ' + comment);
      res.send(comment);
    }
  });
});

app.post('/getComment1', (req, res) => {
  console.log('Getting Comment');
  let id = req.body.id;
  console.log('Id to find is: ' + id);
  console.log('Id to find, using req.body: ' + req.body.id);
  console.log('Id to find, using req.params: ' + req.params.id);
  console.log('Id to find, using req.query: ' + req.query.id);
  console.log('Id to find, using req.body and cast: ' + mongoose.Types.ObjectId(req.body.id));
  console.log('Id to find, using req.params and cast: ' + mongoose.Types.ObjectId(req.params.id));
  console.log('Id to find, using req.query and cast: ' + mongoose.Types.ObjectId(req.query.id));
  Comment.findOne({_id: id})
    .then(data => {
      console.log('data: ' + data);
      // console.log('Groups: ' + data[0].Groups);
      // console.log('rooms: ' + data[0].Groups[0].Rooms);
      // console.log('rooms2: ' + data.Groups[0]);
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/getComments', (req, res) => {
  console.log('Getting Comments');
  Comment.find()
    .then(data => {
      console.log('data: ' + data);
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

app.post('/createComment', (req, res) => {
  console.log('Creating Comment');
  const comment = new Comment({
    content: req.body.content,
    userEmail: req.body.userEmail,
    noteID: mongoose.Types.ObjectId(req.body.noteID),
  });
  comment.save(function (err, note) {
    if (err) {
      return res.send(err);
    }
    Note.findById(req.body.noteID, function (err, note) {
      if (err) {
        return res.send(err);
      }
      note.comments.push(comment);
      note.save(function (err) {
        if (err) {
          return res.send(err);
        }
        res.json(comment);
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
  console.log('Going to delete note with id:  ' +  req.body.id + ' for the group with id ' + req.body.groupID);
  Note.findByIdAndRemove(req.body.id)
    .then(data => {
      Group.updateOne(
        {_id: req.body.groupID},
        {$pull: {notes: req.body.id}},
        groupData => {
          console.log('Group data: ' + groupData);
        },
      );
      console.log('data ', data);
      res.send(data);
    })
    .catch(err => {
      console.log('error', err);
    });
});
//
app.post('/deleteComment', (req, res) => {
  console.log('Going to delete comment with id:  ', req.body.id + ' for the note with id ' + req.body.noteID);
  Comment.findByIdAndRemove(req.body.id)
    .then(data => {
      Note.updateOne(
        {_id: req.body.noteID},
        {$pull: {comments: req.body.id}},
        noteData => {
          console.log('Note data: ' + noteData);
        },
      );
      console.log('data ', data);
      res.send(data);
    })
    .catch(err => {
      console.log('error', err);
    });
});

// start the server listening for requests
app.listen(process.env.PORT || 3001, () => console.log('Server is running...'));
