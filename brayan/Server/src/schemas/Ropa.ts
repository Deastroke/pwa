import mongoose, { Schema, Document } from "mongoose";

interface IPetSchema extends Document {
    nombre: string;
    color: string;
    tamaño: string;
    precio: number;
    userId: mongoose.Schema.Types.ObjectId; 
  }

const RopaSchema = new Schema({
    nombre: { type: String, required: true },
    color: { type: String, required: true }, 
    tamaño: { type: String, required: true },
    precio: { type: Number, required: true }, 
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
}, { collection: "ropa" }); 

export default mongoose.model<IPetSchema>("ropa", RopaSchema);
