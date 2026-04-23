const express = require("express");
const app = express();
const port = 3000;

app.use(express.json())        //---------next 2 ----------Implenenting Routes--------->

// Username, Password // USERS TABLE
// Organisation // ORGANISATION TABLE
// Boards // BOARDS TABLE
// Issues // ISSUES TABLE

const USERS = [];                   //contains ---username, password, and USER_ID that will increment using global counter variable initialising at 1.
const ORGANISATION = [];
const BOARDS = [];
const ISSUES = [];

// CREATING ROUTES
app.post("/signup", (req, res) => {

})
app.post("/signin", (req, res) => {

})
app.post("/organisation", (req, res) => {

})
app.post("/add-members-to-organisation", (req, res) => {

})
app.post("/board", (req, res) => {

})
app.post("/issue", (req, res) => {

})

// READING 
app.get("/boards", (req, res) => {
    res.send({
        "message": "hii"
    }

    )
    
})
app.get("/issues", (req, res) => {
    
})
app.get("/members", (req, res) => {
    
})

// UPDATE ROUTE--------- using path params(remember)
app.put("/issue", (req, res) => {

})

//DELETE ROUTE
app.delete("/members", (req, res) => {

})


app.listen(port)