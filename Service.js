const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
  {
    userId:{
        type: String,
        required: true,
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
    reviews:[
        {
            userName:{
                type: String,
                required: true,
            },
            photoURL:{
                type: String,
                default: null,
            },
            review:{
                type: String,
                required: true,
            },
            time:{
                type: Date,
                required: true,
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
