//external imports
const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const cors = require("cors");
const Service = require('./Service');
const { notFoundHandler, errorHandler } = require("./errorHandler");

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


//app.use(cors());
app.use(cors());

//request parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routing setup
app.get('/test', (req, res) => {
    res.send({
        message: "This is working",
    });
})

// all routes

//add service
app.post('/add-services', (req, res) => {
    const { userId, title, price, photoURL, description } = req.body;
    const date = new Date();

    const newService = new Service({
        userId: userId,
        title,
        photoURL,
        description,
        price,
        time: date,
    });

    newService.save().then(() => {
        res.json({
            success: true,
            message: "Service Added Successfully!",
        });
    }).catch((err) => {
        res.json({
            success: false,
            message: err.message,
        })
    })
});

// get services by user id
app.get('/get-services/:id', (req, res) => {
    const {id} = req.params;

    Service.find({userId: id}).then((result) => {
        res.json({
            success: true,
            message: result,
        });
    }).catch((err) => {
        res.json({
            success: false,
            message: err.message,
        })
    })
});

// get service by service id
app.get('/get-service-details/:id', (req, res) => {
    const { id } = req.params;

    const updatedId = mongoose.Types.ObjectId(id);

    Service.findById(updatedId).then((result) => {
        res.json({
            success: true,
            message: result,
        });
    }).catch((err) => {
        res.json({
            success: false,
            message: err.message,
        })
    })
});


// get all services
app.get('/get-all-services', async(req, res) => {
    try{
        const test = await Service.collection.find().toArray();
        res.json({
            success: true,
            message: test,
        });
    }
    catch(err){
        res.json({
            success: false,
            message: err.message,
        });
    }
});

// add review
app.post('/add-review', (req, res) => {
    const {userName, photoURL, time, review, id } = req.body;

    const updatedId = mongoose.Types.ObjectId(id);
    const updateObject = {
        userName,
        photoURL,
        review,
        time
    }

    Service.updateOne({_id: updatedId}, { $addToSet: { reviews: [updateObject]}}).then((result) => {
        res.json({
            success: true,
            message: "Posted Successfully!",
        });
    }).catch((err) => {
        res.json({
            success: false,
            message: err.message,
        });
    })
});


// 404 handler
app.use(notFoundHandler);

//default error handler
app.use(errorHandler);

//listen app
app.listen(port, () => {
    console.log(`App listening to port ${port}`);
});
