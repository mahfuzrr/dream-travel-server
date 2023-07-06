const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userName:{
        type: String,
    },
    email: {
        type: String,
    },
    uId:{
      type: String, 
    },
    password: {
        type: String,
    },
    role:{
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    avatar: {
        type: String,
    },
    services:{
        type: mongoose.Types.ObjectId,
        ref: 'Services',
        default: null,
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
