//external imports
const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const cors = require("cors");
const Service = require('./Service');
const { notFoundHandler, errorHandler } = require("./errorHandler");
const jwt = require('jsonwebtoken');
const User = require("./User");

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


// all routes

app.get('/', (req, res) => {
    res.json({
        message: "Welcome to api",
    });
});

// verify user
const authCheck = (req, res, next) => {
    const token = req.headers.authorization;

    if(token){
        const decode = jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
            if(err){
                res.json({
                    success: false,
                    message: "Unauthorized Access!",
                })
            }
            else{
                if(!result?.uId){
                    res.json({
                        success: false,
                        message: "Unauthorized Access!",
                    })
                }
                else next();
            }
        });
    }
    else{
        res.json({
            success: false,
            message: "Unauthorized Access !",
        })
    };
}

// jwt
app.post('/jwt-token', (req, res) => {
    const {email, uId} = req.body;
    const token = jwt.sign({
        email,
        uId,
    }, process.env.JWT_SECRET, {
        expiresIn: '3 days'
    });

    res.json({
        success: true,
        token,
    });
});


// add user
app.post('/add-user', (req, res) => {
    const {name, email, password, photoURL, uId} = req.body;

    let newPass = '';
    let avatar = 'https://bootdey.com/img/Content/avatar/avatar6.png';

    if(password)newPass = password;
    if(photoURL)avatar = photoURL;


    const newUser = new User({
        userName: name,
        email,
        password: newPass,
        avatar,
        uId
    });

    newUser.save().then(() => {
        res.json({
            success: true,
            message: 'User saved Successfully',
        });
    }).catch((err) => {
        
        res.json({
            success: false,
            message: err.message,
        })
    })
});

//add service
app.post('/add-services', (req, res) => {
    const { userId, email, title, price, photoURL, description } = req.body;
    const date = new Date();

    const newService = new Service({
        userId: userId,
        email,
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

    Service.find({userId: id}).sort({'createdAt': -1}).limit(3).then((result) => {
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
        const test =  await Service.find();
        //const test1 = await test.toArray();

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

//delete service
app.delete('/delete-service/:id', (req, res) => {
    const {id} = req.params;

    const newId = mongoose.Types.ObjectId(id);

    Service.deleteOne({"_id": newId}).then((result) => {
        res.json({
            success: 'true',
            message: 'Deleted Successfully',
        });
    }).catch((err) => {
        res.json({
            success: false,
            message: err.message,
        })
    })
})

// add review
app.post('/add-review', (req, res) => {
    const {uId, serviceName, serviceId, userName, photoURL, time, review, id } = req.body;

    const updatedId = mongoose.Types.ObjectId(id);

    const updateObject = {
        uId,
        serviceName,
        serviceId,
        userName,
        photoURL,
        review,
        time
    }

    Service.updateOne({_id: updatedId}, { $addToSet: { reviews: [updateObject]}}).then((result) => {
        res.json({
            success: true,
            message: result,
        });
    }).catch((err) => {
        res.json({
            success: false,
            message: err.message,
        });
    })
});


// get review by uid
app.get('/get-user-reviews/:id', async(req, res) => {
    const {id} = req.params;
    try{
        const test = await Service.find({reviews: {$elemMatch: {uId: id}}});
        console.log(test);
        res.json({
            success: true,
            message: test,
        });
    }catch(err){
        res.json({
            success: false,
            message: err.message,
        })
    }
});

// update review
app.patch('/update-review', (req, res) => {
    const {review, sid, rid} = req.body;

    const updatedId = mongoose.Types.ObjectId(sid);
    const updatedId1 = mongoose.Types.ObjectId(rid);

    Service.updateOne({_id: updatedId, "reviews._id": updatedId1}, {$set: {"reviews.$.review": review}}).then((result) => {
        res.json({
            success: true,
            message: result,
        })
    }).catch((err) => {
        res.json({
            success: false,
            message: err.message,
        })
    })
})

// delete review
app.patch('/delete-review', (req, res) => {
    const {sid, rid} = req.body;
    const updatedId = mongoose.Types.ObjectId(sid);
    const updatedId1 = mongoose.Types.ObjectId(rid);
    
    Service.updateOne({_id: updatedId}, { $pull: { reviews: { _id: updatedId1 } }}).then((result) => {
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
})

// 404 handler
app.use(notFoundHandler);

//default error handler
app.use(errorHandler);

//listen app
app.listen(port, () => {
    console.log(`App listening to port ${port}`);
});
