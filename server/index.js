const express= require('express');
const mongoose= require('mongoose');
const cors= require('cors');
const app= express();
require('dotenv').config();
const helmet= require('helmet');

const auth= require('./routes/auth.routes');
const play= require('./routes/play.routes');
const contribution= require('./routes/contribution.routes');
const cookieParser = require('cookie-parser');

app.use(helmet());
// app.disable('x-powered-by');

app.use(cors(
    {
        origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
));
app.use(express.json());
app.use(cookieParser())

app.use('/auth', auth);
app.use('/play', play);
app.use('/contribution', contribution);

const port= process.env.PORT;
const mongoURI= process.env.MONGO_URI;
// const mongoURI= process.env.MONGO_URI_LOCAL;
if (!port) {
    console.error("PORT not found in .env");
}
if (!mongoURI) {
    console.error("MONGO_URI not found in .env");
}

//TEST
app.get('/', (req, res)=>{
    res.send('Hello');
})

mongoose.connect(mongoURI)
.then(
    ()=>{
        console.log("DB is Connected!");
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    }
)
.catch(
    (err)=>{
        console.error("DB connection failed!");
        console.error(err);
    }
)

