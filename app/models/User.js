const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


let userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
    if(this.isModified('password') || this.isNew('password')) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt)
        next(); 
    }
})

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email})
    if(user) {
        const auth = await bcrypt.compare(password, user.password)
        if(auth) {
            return user
        }
        throw Error("incorrect password")
    }
    throw Error("incorrect email")
}


const User = mongoose.model("user", userSchema)

module.exports = User;