import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
// import _ from 'lodash';
const Schema = mongoose.Schema;
const THRESHOLD = 5000;

function usedTokenFilter(tokenData) {
  return tokenData.usedAt >= Date.now() - THRESHOLD;
}

class UserClass {
  allValidTokens() {
    return this.tokens.concat(
      this.usedTokens.filter(usedTokenFilter).map((tokenData) => tokenData.token)
    );
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

export default mongoose.model('User', UserSchema);
