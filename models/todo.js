const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User_VP'
  },
  title: {
    type: String,
    minlength: 5
  },
  description: {
    type: String
  },
  priority: {
    type: Number
  },
  isCompleted: {
    type: Boolean,
    required: true
  }
});

todoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Todo_VP', todoSchema);
