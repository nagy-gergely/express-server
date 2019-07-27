const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function (next)  {
    try {
        if(!this.isModified('password')) {
            return next();
        }
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next()
    } catch (error) {
        next(error);
    }
});

userSchema.method('comparePassword', async function(givenPassword, next) {
    try {
        const isMatch = await bcrypt.compare(givenPassword, this.password);
        return isMatch;
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);