const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
  {
    userId:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: null,
    },
    title:{
        type: String,
        required: true,
    },
    photoURL:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: String,
        default: 0,
    },
    time:{
        type: Date,
        required: true,
    },
    reviews:[
        {
            uId:{
                type: String,
                default: null,
            },
            serviceName:{
                type: String,
                default: null,
            },
            serviceId:{
                type: String,
                default: null,
            },
            userName:{
                type: String,
                default: null,
            },
            photoURL:{
                type: String,
                default: null,
            },
            review:{
                type: String,
                default: null,
            },
            time:{
                type: String,
                default: null,
            },
        }
    ]
  },
  {
    timestamps: true,
  }
);

const Services = mongoose.model("Service", serviceSchema);
module.exports = Services;
