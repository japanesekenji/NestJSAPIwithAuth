import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as gravatar from 'gravatar';

export const UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    avatar: String,
    bio: String
}, {
  timestamps: true
});

UserSchema.pre('save', function(next){

    let user: any = this;

    // Set Gravatar image
    if (!user.avatar) {
      user.avatar = gravatar.url(user.email, {protocol: 'https'});
    }

    // Make sure not to rehash the password if it is already hashed
    if(!user.isModified('password')) return next();

    // Generate a salt and use it to hash the user's password
    bcrypt.genSalt(10, (err, salt) => {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {

            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
}); 

UserSchema.methods.checkPassword = function(attempt, callback){
    let user = this;

    bcrypt.compare(attempt, user.password, (err, isMatch) => {
        if(err) return callback(err);
        callback(null, isMatch);
    });
};