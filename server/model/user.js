import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
  email: String,
  password: String,
  tokens: [String],
});

User.plugin(passportLocalMongoose);
User.index({ email: 1 });

export default mongoose.model('Account', User);
