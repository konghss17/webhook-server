const express = require("express");
const app = express();

app.use(express.json());

const admin = require("firebase-admin");

// 🔥 ใส่ config Firebase ของคุณ
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://read-novel-82d1c-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const db = admin.database();

app.post("/webhook", async (req, res) => {
    const data = req.body;

    console.log("Webhook:", data);

    // 🔥 ตรวจว่า payment สำเร็จ
    if (data.data && data.data.status === "successful") {
        
        const amount = data.data.amount / 100; // บาท
        const username = data.data.metadata?.username;

        if (!username) return res.sendStatus(200);

        // 🔥 เติม coin
        const userRef = db.ref("novel_system_db/users/" + username);

        const snap = await userRef.once("value");
        const user = snap.val();

        const newCoin = (user.coin || 0) + amount;

        await userRef.update({
            coin: newCoin
        });

        console.log(`เติมเงินให้ ${username}: +${amount}`);
    }

    res.sendStatus(200);
});

app.get("/", (req, res) => {
    res.send("Server running");
});

app.listen(process.env.PORT || 3000);
