import HttpStatus from 'http-status-codes';
import { log } from 'winston';
import * as UserService from '../services/user.service';


export const getallUsers = async (req,res,next) =>{
  try {
    const data = await UserService.getAllUsers()
    res.status(HttpStatus.OK).json({
      code:HttpStatus.OK,
      data: data,
      message: "this is all user u have registered with"

    })
  } catch (error) {
    next(error);
  } 
}

/**
 * Controller to create a new user
 * @param  {object} req - request object
 * @param {object} res - response object
 * @param {Function} next
 */



export const userRegistration = async (req, res) => {
  try {
    const data = await UserService.userRegistration(req.body);  
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      data: data,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(HttpStatus.CONFLICT).json({
      code : HttpStatus.CONFLICT,
      message :  `${error}`
    })  
  }
};


export const login = async (req, res) => {
  try { 

    const data = await UserService.login(req.body);
    if(data == null) { 
      res.status(HttpStatus.NOT_FOUND).json({
        code : HttpStatus.NOT_FOUND,
        message : `${error}`
      })
    }
    else{
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'login Successfully'
      }); 
    }  
  
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code : HttpStatus.BAD_REQUEST,
      message :  `${error}`
    })
  }
};

export const forgetPassword = async (req,res)=>{
  try {
    console.log(req.body)
    const data = await UserService.forgetPassword(req.body.emailID);
    console.log(data);
    res.status(HttpStatus.OK).json({
      code:HttpStatus.OK,
      data: data,
      message: "password has sent Successfully to email"
    })
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND).json({
      code : HttpStatus.NOT_FOUND,
      message : `${error}`
    })
  }
}




export const resetPassword = async (req,res) => {
  try {
    req.body.UserID = req.body.data.id;
    console.log(req.body.password);
    const resetPasswordData = await UserService.resetPassword(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data : resetPasswordData,
      message: "password reset successfully"
    })
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code : HttpStatus.BAD_REQUEST,
      message :  `${error}`
    })  
  }

}








