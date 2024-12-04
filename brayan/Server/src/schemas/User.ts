import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcryptjs';

// Interfaz para definir el tipo de datos en el modelo de usuario
interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}

// Esquema de Usuario
const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
}, { collection: "User", timestamps: true });

// Middleware para encriptar la contraseña antes de guardar
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Método para comparar la contraseña en el login
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Exportando el modelo de Usuario
export default mongoose.model<IUser>("User", UserSchema);