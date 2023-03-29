const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


let userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    created_at: { type: Date, default: Date.Now()},
    updated_at: { type: Date, default: Date.now() },
});

userSchema.pre("save", function (next) {
    if (this.isNew || this.isModified('password')) { // new register or password change
        const salt = bcrypt.genSalt();
        bcrypt.hash(this.password, salt, (err, hashedPassword) => {
            if(err) {
                next(err);
            } else {
                this.passoword = hashedPassword;
                next();
            }
        })
    }
})

module.export = mongoose.model("User", userSchema);