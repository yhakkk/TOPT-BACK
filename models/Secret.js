import mongoose from 'mongoose';

const SecretSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true
    },
    empresa:{
        type: String,
        required:true
    },
  secret: {
    type: String,
    required: true,
  },
  otpauthUrl: {
    type: String,
    required: true,
  }
},{timestamps:true});

const Secret = mongoose.model('Secret', SecretSchema);

export default Secret;
