const express = require("express");
const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
    console.log("Webhook received:", req.body);
    res.sendStatus(200);
});

app.get("/", (req, res) => {
    res.send("Server running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
