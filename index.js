const express = require("express");
const path = require("path")
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");
const { organizationModel, userModel, boardModel, issueModel } = require("./models");

const app = express();
app.use(express.json());

// ================= AUTH =================

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    const userExists = await userModel.findOne({ username });

    if (userExists) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const newUser = await userModel.create({ username, password });

    res.json({
        id: newUser._id,
        message: "Signup successful"
    });
});

app.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username, password });

    if (!user) {
        return res.status(403).json({
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign(
        { userId: user._id },
        "Rishav1471"
    );

    res.json({ token });
});

// ================= ORGANIZATION =================

app.post("/organization", authMiddleware, async (req, res) => {
    const { title, description } = req.body;

    const org = await organizationModel.create({
        title,
        description,
        admin: req.userId,
        members: []
    });

    res.json({ message: "Org created", org });
});

app.post("/organization/member", authMiddleware, async (req, res) => {
    const { organizationId, memberUsername } = req.body;

    const org = await organizationModel.findById(organizationId);

    if (!org || org.admin.toString() !== req.userId) {
        return res.status(403).json({
            message: "Not allowed"
        });
    }

    const user = await userModel.findOne({ username: memberUsername });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (!org.members.includes(user._id)) {
        org.members.push(user._id);
        await org.save();
    }

    res.json({ message: "Member added" });
});

app.delete("/organization/member", authMiddleware, async (req, res) => {
    const { organizationId, memberUsername } = req.body;

    const org = await organizationModel.findById(organizationId);

    if (!org || org.admin.toString() !== req.userId) {
        return res.status(403).json({
            message: "Not allowed"
        });
    }

    const user = await userModel.findOne({ username: memberUsername });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    org.members = org.members.filter(
        id => id.toString() !== user._id.toString()
    );

    await org.save();

    res.json({ message: "Member removed" });
});

app.get("/organization", authMiddleware, async (req, res) => {
    const { organizationId } = req.query;

    const org = await organizationModel.findById(organizationId).populate("members", "username");

    if (!org) {
        return res.status(404).json({
            message: "Org not found"
        });
    }

    if (
        org.admin.toString() !== req.userId &&
        !org.members.some(m => m._id.toString() === req.userId)
    ) {
        return res.status(403).json({
            message: "Access denied"
        });
    }

    res.json(org);
});

// ================= BOARD =================

app.post("/board", authMiddleware, async (req, res) => {
    const { organizationId, title } = req.body;

    const org = await organizationModel.findById(organizationId);

    if (!org) {
        return res.status(404).json({ message: "Org not found" });
    }

    if (
        org.admin.toString() !== req.userId &&
        !org.members.includes(req.userId)
    ) {
        return res.status(403).json({ message: "Access denied" });
    }

    const board = await boardModel.create({
        title,
        organizationId
    });

    res.json({ message: "Board created", board });
});

app.get("/boards", authMiddleware, async (req, res) => {
    const { organizationId } = req.query;

    const boards = await boardModel.find({ organizationId });

    res.json({ boards });
});

// ================= ISSUES =================

app.post("/issue", authMiddleware, async (req, res) => {
    const { boardId, title, description, assignedTo } = req.body;

    const board = await boardModel.findById(boardId);

    if (!board) {
        return res.status(404).json({ message: "Board not found" });
    }

    const issue = await issueModel.create({
        title,
        description,
        boardId,
        assignedTo,
        status: "TODO"
    });

    res.json({ message: "Issue created", issue });
});

app.get("/issues", authMiddleware, async (req, res) => {
    const { boardId } = req.query;

    const issues = await issueModel.find({ boardId });

    res.json({ issues });
});

app.put("/issue", authMiddleware, async (req, res) => {
    const { issueId, status } = req.body;

    const issue = await issueModel.findById(issueId);

    if (!issue) {
        return res.status(404).json({
            message: "Issue not found"
        });
    }

    issue.status = status;
    await issue.save();

    res.json({ message: "Issue updated", issue });
});

// ================= FRONTEND =================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ================= SERVER =================

app.listen(3000, () => {
    console.log("Server running on port 3000");
});