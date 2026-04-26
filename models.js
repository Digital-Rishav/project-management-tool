const mongoose = require("mongoose");

mongoose.connect("");

const userSchema = mongoose.Schema({
    username: String,
    password: String
});

const organizationSchema = mongoose.Schema({
    title: String,
    description: String,
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const boardSchema = mongoose.Schema({
    title: String,
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }
});

const issueSchema = mongoose.Schema({
    title: String,
    description: String,
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: String
});

const organizationModel = mongoose.model("Organization", organizationSchema);
const userModel = mongoose.model("User", userSchema);
const boardModel = mongoose.model("Board", boardSchema);
const issueModel = mongoose.model("Issue", issueSchema);

module.exports = {
    organizationModel,
    userModel,
    boardModel,
    issueModel
};