const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

userSchema.plugin(passportLocalMongoose); //? ini adalah plugin untuk menghash password dan otomatis save dan melakukan filter data jika username sama maka ada message error username already

module.exports = mongoose.model("User", userSchema);
