import mongoose, { Document, Schema } from 'mongoose';
const bcrypt = require('bcrypt')

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  isValidPassword(newPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

UserSchema.methods.isValidPassword = async function (newPassword: string) {
  return bcrypt.compare(newPassword, this.password);
}

const User = mongoose.model<IUser>('User', UserSchema);

export default User;