
import { User } from "../models/User";
import generateToken from "../utils/generateToken";

export const registerAccount = async (userData: any) => {
  // Implement registration logic here
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  /* This first email registered user is promoted to admin */
  const adminCount = await User.countDocuments({ role: "admin" });
  const role = adminCount === 0 ? "admin" : "user";

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id.toString());

  return { user, token };
};


export const loginAccount = async (email: string, password: string) =>{
    const user = await User.findOne({email});
    const compare = user && await user.comparePassword(password);
    if(!user || !compare) {
        throw new Error("Invalid email or password");
    }
    const token = generateToken(user._id.toString());
    return { user, token };
}

export const getMe = async (userId: string) =>{
   const user = await User.findById(userId).select('-password');
   if (!user){
    throw new Error("User not found");
   } 
   return user;
}

export const updateProfile = async (userId: string, updateData: any) =>{
    return await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
     ).select('-password')
}