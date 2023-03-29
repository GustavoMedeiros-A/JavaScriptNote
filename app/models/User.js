const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


let userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    created_at: { type: Date, default: Date.Now()},
    updated_at: { type: Date, default: Date.now() },
});

userSchema.pre()

module.export = mongoose.model("User", userSchema);