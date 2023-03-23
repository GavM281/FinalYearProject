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

const Note = mongoose.model('Note', {
  name: String,
  content: String,
  userEmail: String,
  privacy: String,
  groupID: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

const Group = mongoose.model('Group', {
  name: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
});

const Comment = mongoose.model('Comment', {
  content: String,
  userEmail: String,
  noteID: mongoose.Schema.Types.ObjectId,
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

// Get all notes
app.get('/getNotes', (req, res) => {
  console.log('Getting Notes');
  console.log('getNotes array: ' + req.body.ids);

  Note.find({})
    .then(data => {
      console.log('data: ', data);
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

// Get all modules
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

// Get single note
app.post('/getSingleNote', (req, res) => {
  console.log('Getting Note with id: ' + req.body.id);
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

app.post('/getSingleGroup', (req, res) => {
  console.log('Getting Group with id: ' + req.body.id);
  Group.findById(req.body.id)
    .then(data => {
      console.log('data: ', data);
      res.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

// Get user
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

// Get comment
app.post('/getComment', (req, res) => {
  console.log('Getting Comment');
  let id = req.body.id;
  console.log('Id to find is: ' + id);
  Comment.findById(id)
    .then(data => {
      console.log('data: ' + data);
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
  });
  note.save(function (err, note) {
    if (err) {
      return res.send(err);
    }
    // Get group that note is a part of
    Group.findById(req.body.groupID, function (err, group) {
      if (err) {
        return res.send(err);
      }
      group.notes.push(note); // Add note to array in group
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
      // Get note that comment is on
      if (err) {
        return res.send(err);
      }
      note.comments.push(comment); // Add comment to array in note
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

// Delete note and remove id from group
app.post('/deleteNote', (req, res) => {
  console.log(
    'Going to delete note with id:  ' +
      req.body.id +
      ' for the group with id ' +
      req.body.groupID,
  );
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
// Delete comment and remove id from note
app.post('/deleteComment', (req, res) => {
  console.log(
    'Going to delete comment with id:  ',
    req.body.id + ' for the note with id ' + req.body.noteID,
  );
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

// Start server
app.listen(process.env.PORT || 3001, () => console.log('Server is running...'));
