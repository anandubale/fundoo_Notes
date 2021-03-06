import User from '../models/user.model';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {sendMailTo} from '../utils/helper.js';
import {sender} from '../utils/rabitMQ';


//get all users

export const getAllUsers = async () => {
  const data = await User.find();
  if(data.length == 0){
    throw new Error("no content")
  }
  else{
    return data;
  }
};


//create new user
export const userRegistration = async (body) => {
  const saltRounds = 10;
  const hasedPassword = bcrypt.hashSync(body.password,saltRounds); 
  body.password = hasedPassword;
  console.log(body.emailID);
  const previous_check = await User.findOne({emailID : body.emailID})
  if(previous_check != null){
      throw new Error("User Already registered");
  }
  else
  {
    const data = await User.create(body);  
    sender(data);
    return data;   
  }
}; 


// login user;

               
export const login = async  (body)=>{

  const user = await User.findOne({emailID: body.emailID})
  
  const validPassword = bcrypt.compareSync(body.password, user.password);
  if(validPassword)
  {
    const token = jwt.sign({"emailID": user.emailID,"id":user._id}, process.env.NOTE_SECRET_CODE);
    return token;
  }
  else
  {
    throw new Error('password does not match');
  }
}
 





export const forgetPassword = async (emailID) => {

  const storedData = await User.findOne({emailID})  
  console.log(storedData);
  if(storedData.emailID != null ){
    const token = jwt.sign({"emailID": storedData.emailID,"id":storedData._id},process.env.FORGET_PASS_CODE );
    console.log(token);
    const generateMail = sendMailTo(storedData.emailID, token);
    console.log("After sending mail" + generateMail);
    return generateMail;
  }
  else{
    throw new Error("email is not registered")
  }
}



export const resetPassword = async (body) => {
  const hashP = bcrypt.hashSync(body.password ,10);
  body.password = hashP;
  const resetPass = await User.findByIdAndUpdate( body.UserID,
  body,
  {
    new :true
  });
    return resetPass;
  }



