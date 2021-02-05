import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    socketId: String,
  },
  { timestamps: true },
);

mongoose.model('User', UserSchema);
