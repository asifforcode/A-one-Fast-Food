import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect("mongodb+srv://asiffood:12200400@cluster0.ithnv.mongodb.net/Asiffood").then(() => console.log("DB Connected"));
};