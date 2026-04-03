import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: Number,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 10,
    },

    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+@.+\..+/,
    },

    password: {
      type: String,
      required: true,
    },

    last_seen: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);


export default mongoose.model('User', userSchema);
