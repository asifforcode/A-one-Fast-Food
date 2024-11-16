// import mongoose from "mongoose";

// const foodSchema = mongoose.Schema({
//     name: {type:String,required:true},
//     description: {type:String,required:true},
//     price: {type:Number,required:true},
//     image: {type:String,required:true},
//     category: {type:String,required:true},
// });

// const foodModel = mongoose.models.food || mongoose.model("food",foodSchema);

// export default foodModel;

import mongoose from "mongoose";

const foodSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    category: {type: String, required: true},
});

// Customize the output by converting _id to id in the response
foodSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;  // Rename _id to id
        delete ret._id;    // Remove _id from the output
        return ret;
    }
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
