const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const usersSchema = new mongoose.Schema({
    email: { // The 'user_id' in .proto will map to '_id.toString()'.
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    userName: { // Maps to user_name in proto
        type: String,
        required: true,
        trim: true,
    },
    password: { // Maps to password in proto
        type: String,
        required: true,
    },
    avatar: { // Maps to avatar in proto
        type: String,
        trim: true,
        default: ""
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        required: true,
        uppercase: true,
        trim: true,
        default: "USER"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

usersSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

usersSchema.methods.isPasswordValid = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Users", usersSchema);