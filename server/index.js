const express= require('express');
const mongoose= require('mongoose');
const cors= require('cors');
const app= express();
require('dotenv').config();

const auth= require('./routes/auth.routes');
const play= require('./routes/play.routes');

app.use(express.json());
app.use(cors());
app.use('/auth', auth);
app.use('/play', play);

const port= process.env.PORT || 5000;
const mongoURL= process.env.MONGO_URL;
if (!port) {
    console.error("❌ PORT not found in .env");
}
if (!mongoURL) {
    console.error("❌ MONGO_URL not found in .env");
}

//TEST
app.get('/', (req, res)=>{
    res.send('Hello');
})

mongoose.connect(mongoURL)
.then(
    ()=>{
        console.log("✅ DB is Connected!");
        app.listen(port, () => {
            console.log(`🚀 Server is running at http://localhost:${port}`);
        });
    }
)
.catch(
    (err)=>{
        console.error("❌ DB connection failed!");
        console.error(err);
    }
)

