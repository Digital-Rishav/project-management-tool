const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware");

const app = express();
app.use(express.json());

// IDs
let USERS_ID = 1;
let ORGANIZATION_ID = 1;
let BOARD_ID = 1;
let ISSUE_ID = 1;

// In-memory DB
const USERS = [];
const ORGANIZATIONS = [];
const BOARDS = [];
const ISSUES = [];

// ================= AUTH =================

// Signup
app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    const userExists = USERS.find(u => u.username === username);
    if (userExists) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    USERS.push({
        id: USERS_ID++,
        username,
        password
    });

    res.json({ message: "Signup successful" });
});

// Signin
app.post("/signin", (req, res) => {
    const { username, password } = req.body;

    const user = USERS.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(403).json({
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign(
        { userId: user.id },
        "Rishav1471password"
    );

    res.json({ token });
});

// ================= ORGANIZATION =================

// Create org
app.post("/organization", authMiddleware, (req, res) => {
    const { title, description } = req.body;

    const org = {
        id: ORGANIZATION_ID++,
        title,
        description,
        admin: req.userId,
        members: []
    };

    ORGANIZATIONS.push(org);

    res.json({ message: "Org created", org });
});

// Add member
app.post("/organization/member", authMiddleware, (req, res) => {
    const { organizationId, memberUsername } = req.body;

    const org = ORGANIZATIONS.find(o => o.id === organizationId);

    if (!org || org.admin !== req.userId) {
        return res.status(403).json({
            message: "Not allowed"
        });
    }

    const user = USERS.find(u => u.username === memberUsername);
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (!org.members.includes(user.id)) {
        org.members.push(user.id);
    }

    res.json({ message: "Member added" });
});

// Remove member
app.delete("/organization/member", authMiddleware, (req, res) => {
    const { organizationId, memberUsername } = req.body;

    const org = ORGANIZATIONS.find(o => o.id === organizationId);

    if (!org || org.admin !== req.userId) {
        return res.status(403).json({
            message: "Not allowed"
        });
    }

    const user = USERS.find(u => u.username === memberUsername);
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    org.members = org.members.filter(id => id !== user.id);

    res.json({ message: "Member removed" });
});

// Get org
app.get("/organization", authMiddleware, (req, res) => {
    const organizationId = parseInt(req.query.organizationId);

    const org = ORGANIZATIONS.find(o => o.id === organizationId);

    if (!org) {
        return res.status(404).json({
            message: "Org not found"
        });
    }

    // Allow admin OR members
    if (org.admin !== req.userId && !org.members.includes(req.userId)) {
        return res.status(403).json({
            message: "Access denied"
        });
    }

    res.json({
        ...org,
        members: org.members.map(id => {
            const user = USERS.find(u => u.id === id);
            return { id: user.id, username: user.username };
        })
    });
});

// ================= BOARD =================

// Create board
app.post("/board", authMiddleware, (req, res) => {
    const { organizationId, title } = req.body;

    const org = ORGANIZATIONS.find(o => o.id === organizationId);

    if (!org) {
        return res.status(404).json({ message: "Org not found" });
    }

    if (org.admin !== req.userId && !org.members.includes(req.userId)) {
        return res.status(403).json({ message: "Access denied" });
    }

    const board = {
        id: BOARD_ID++,
        title,
        organizationId
    };

    BOARDS.push(board);

    res.json({ message: "Board created", board });
});

// Get boards
app.get("/boards", authMiddleware, (req, res) => {
    const { organizationId } = req.query;

    const boards = BOARDS.filter(
        b => b.organizationId === parseInt(organizationId)
    );

    res.json({ boards });
});

// ================= ISSUES =================

// Create issue
app.post("/issue", authMiddleware, (req, res) => {
    const { boardId, title, description, assignedTo } = req.body;

    const board = BOARDS.find(b => b.id === boardId);
    if (!board) {
        return res.status(404).json({ message: "Board not found" });
    }

    const issue = {
        id: ISSUE_ID++,
        title,
        description,
        boardId,
        assignedTo,
        status: "TODO"
    };

    ISSUES.push(issue);

    res.json({ message: "Issue created", issue });
});

// Get issues
app.get("/issues", authMiddleware, (req, res) => {
    const { boardId } = req.query;

    const issues = ISSUES.filter(
        i => i.boardId === parseInt(boardId)
    );

    res.json({ issues });
});

// Update issue
app.put("/issue", authMiddleware, (req, res) => {
    const { issueId, status } = req.body;

    const issue = ISSUES.find(i => i.id === issueId);

    if (!issue) {
        return res.status(404).json({
            message: "Issue not found"
        });
    }

    issue.status = status;

    res.json({ message: "Issue updated", issue });
});

// ================= SERVER =================

app.listen(3000, () => {
    console.log("Server running on port 3000");
});