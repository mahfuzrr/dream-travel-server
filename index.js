//external imports
const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 5000;

const app = express();
dotenv.config();

//database connection
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database connection Successfull"))
    .catch((error) => console.log(error.message, process.env.MONGO_URL));

//cors
const corsOptions = {
    origin: true, //included origin as true
    credentials: true, //included credentials as true
}

//app.use(cors());
app.use(cors(corsOptions));

//request parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routing setup
app.get('/test', (req, res) => {
    res.send({
        message: "This is working",
    });
})


//listen app
app.listen(port, () => {
    console.log(`App listening to port ${port}`);
});
