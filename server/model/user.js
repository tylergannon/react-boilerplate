import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
// import _ from 'lodash';
const Schema = mongoose.Schema;

class UserClass {
  static async addToken(user, { newToken }) {
    try {
      await User.findByIdAndUpdate(user.id, { $push: { tokens: newToken } }).exec();
    } catch (errors) {
      console.error(errors);
    }
  }
  static async expireToken(user, { oldToken }) {
    try {
      await User.findByIdAndUpdate(user.id, { $pull: { tokens: oldToken } }).exec();
    } catch (errors) {
      console.error(errors);
    }
  }
  static async replaceToken(user, { oldToken, newToken }) {
    try {
      await User.bulkWrite([{
        updateOne: {
          filter: { _id: user.id },
          update: { $pull: { tokens: oldToken } },
        },
      }, {
        updateOne: {
          filter: { _id: user.id },
          update: { $push: { tokens: newToken } },
        },
      }]);
      // await User.findByIdAndUpdate(user.id, { $pull: { tokens: oldToken }, $push: { tokens: newToken } });
      // await User.findByIdAndUpdate(user.id, { $pull: { tokens: oldToken }, $push: { tokens: newToken } });
    } catch (errors) {
      console.error(errors);
    }
  }
}

const UserSchema = new Schema({
  email: String,
  password: String,
  tokens: [String],
  usedTokens: [{
    usedAt: Number,
    token: String,
  }],
});


UserSchema.plugin(passportLocalMongoose);
UserSchema.index({ email: 1 });
UserSchema.loadClass(UserClass);
const User = mongoose.model('User', UserSchema);
export default User;
