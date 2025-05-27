import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer_config.js";
import mongoose from "mongoose";
import { isUserEmailExisting, isUserIDExisting } from '../functions/functions.js';

export const register = async(req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const empID =  req.body.employeeID;
    const pwd = req.body.password;
    const conPassword = req.body.confirmPassword;
    const lName = req.body.lastName;
    const fName = req.body.firstName;
    const mName = req.body.middleName;
    const contactNum = req.body.contactNumber;
    const emailAdd = req.body.emailAddress;
    const add = req.body.address;

    if(!empID){
        return res.status(400).json({success: false, message: "Invalid Employee ID!"});
    }

    if(!pwd){
        return res.status(400).json({success: false, message: "Please provide a password!"});
    }else if(!conPassword){
        return res.status(400).json({success: false, message: "Please confirm the employee's password!"});
    }else if(pwd.length < 10){
        return res.status(400).json({success: false, message: "Password should not be less than 10 characters length!"});
    }else if(pwd !== conPassword){
        return res.status(400).json({success: false, message: "Password mismatched!"});
    }

    if(!lName){
        return res.status(400).json({success: false, message: "Please provide the employee's Last Name!"});
    }else if(!fName){
        return res.status(400).json({success: false, message: "Please provide the employee's First Name!"});
    }else if(!mName){
        return res.status(400).json({success: false, message: "Please provide the employee's Middle Name!"});
    }


    if(!contactNum){
        return res.status(400).json({success: false, message: "Please provide the employee's Contact Number!"});
    }

    if(!emailAdd){
        return res.status(400).json({success: false, message: "Please provide the employee's Email Address!"});
    }

    
    
    if(!add){
        return res.status(400).json({success: false, message: "Please provide the employee's address!"});
    }


    const salt = Number (process.env.SALT || 10);

    const session = await mongoose.startSession();
    try{
        
        if(await isUserIDExisting(empID)){
            return res.status(400).json({success: false, message: "Employee ID is already registered!"});
        }

        if(await isUserEmailExisting(emailAdd)){
            return res.status(400).json({success: false, message: "Email Address is already in use!"});
        }

        session.startTransaction();
        const hashedPassword = await bcrypt.hash(pwd, salt);

        const user = new User();
        user.employeeID = empID.toString();
        user.password = hashedPassword;
        user.lastName=lName;
        user.firstName=fName;
        user.middleName=mName;
        user.contactNumber=contactNum;
        user.emailAddress=emailAdd;
        user.address=add;
        
        await user.save({session});

        const mailContents = {
            from: process.env.SENDER_EMAIL_ID,
            to: emailAdd,
            subject: "Welcome to SmartBin v_0.1 User Admin Console",
            text: `Welcome to SmartBin v_0.1 User Admin Console. You have successfully registered your account with email: `+emailAdd+"\n\nThank you."
        }

        await transporter.sendMail(mailContents);
        await session.commitTransaction();

        res.status(200).json({success: true, data: [user]});
    }catch(error){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        console.error("Error in User Account creation! - "+error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}

export const update = async(req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const id=req.body._id;
    const empID =  req.body.employeeID;
    const lName = req.body.lastName;
    const fName = req.body.firstName;
    const mName = req.body.middleName;
    const contactNum = req.body.contactNumber;
    const emailAdd = req.body.emailAddress;
    const add = req.body.address;
    
    if(!empID){
        return res.status(400).json({success: false, message: "Invalid Employee ID!"});
    }

    if(!lName){
        return res.status(400).json({success: false, message: "Please provide the employee's Last Name!"});
    }else if(!fName){
        return res.status(400).json({success: false, message: "Please provide the employee's First Name!"});
    }else if(!mName){
        return res.status(400).json({success: false, message: "Please provide the employee's Middle Name!"});
    }

    if(!contactNum){
        return res.status(400).json({success: false, message: "Please provide the employee's Contact Number!"});
    }

    if(!emailAdd){
        return res.status(400).json({success: false, message: "Please provide the employee's Email Address!"});
    }
    
    if(!add){
        return res.status(400).json({success: false, message: "Please provide the employee's address!"});
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(401).json({success: false, message: "Invalid Employee DB ID!"});
    }

    const session = await mongoose.startSession();
    try{

        const onRecordUser = await User.findById(id);
        if(!onRecordUser){
            return res.status(401).json({success: false, message: "Invalid Employee DB ID!"});
        }
        
        if(await isUserIDExisting(empID, id)){
            return res.status(400).json({success: false, message: "Employee ID is already in use!"});
        }

        if(await isUserEmailExisting(emailAdd, id)){
            return res.status(400).json({success: false, message: "Email Address is already in use!"});
        }

        session.startTransaction();

        onRecordUser.employeeID = empID.toString();
        onRecordUser.lastName=lName;
        onRecordUser.firstName=fName;
        onRecordUser.middleName=mName;
        onRecordUser.contactNumber=contactNum;
        onRecordUser.emailAddress=emailAdd;
        onRecordUser.address=add;
        
        const updatedUser =await User.findByIdAndUpdate(id, onRecordUser, {new:true, session});

        await session.commitTransaction();

        res.status(200).json({success: true, data: [updatedUser]});
    }catch(error){
        await session.abortTransaction();
        console.error("Error in User Account update! - "+error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}

export const login = async (req, res) =>{
    if(!req.body){
        return res.status(200).json({success: false, message: "Invalid values!"});
    }

    const employeeID = req.body.employeeID;
    const password = req.body.password;

    if(!employeeID){
        return res.status(200).json({success: false, message: "Invalid Employee ID number!"});
    }

    if(!password){
        return res.status(200).json({success: false, message: "Invalid Password!"});
    }

    try{
        const userData = await User.findOne({employeeID});
        if(!userData){
            return res.status(200).json({success: false, message: "Invalid Employee ID number or Password!"});
        }

        const correctPassword = await bcrypt.compare(password, userData.password);

        if(!correctPassword){
            return res.status(200).json({success: false, message: "Invalid Employee ID number or Password!"});
        }

        const token = jwt.sign({id: userData._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({success: true, message: "Login Successful!"});

    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }

    return res;
}

export const logout = async (req, res) =>{
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict'
        });

        res.status(200).json({success: true, message: "Logged out!"});
    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }

    return res;
}

export const sendPasswordResetOTP = async (req, res) =>{
    if(!req.body){
        return res.status(200).json({success: false, message: "Invalid values!"});
    }

    const email = req.body.emailAddress;

    if(!email){
        return res.status(200).json({success: false, message: "Invalid email!"});
    }

    try{
        const userData = await User.findOne({emailAddress: email});
        if(!userData){
            res.status(200).json({success: false, message: "No Employee Account found with this email!"});
        }else{
            const otp = String(Math.floor(100000 + Math.random() * 900000));

            userData.resetOTP = otp;
            userData.resetOTPExpire = Date.now() + 5 * 60 * 1000;

            await User.findByIdAndUpdate(userData._id, userData);

            const mailContents = {
                from: process.env.SENDER_EMAIL_ID,
                to: userData.emailAddress,
                subject: "SmartBin v_0.1 User Admin Console Password Reset verification OTP",
                text: `Your SmartBin v_0.1 User Admin Console Password Reset OTP code is ${otp}. Please verify your account using this code to reset your password.`
            }
    
            await transporter.sendMail(mailContents);

            res.status(200).json({success: true, message: "Password Reset OTP codes sent successfully!"});
        }

    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }

    return res;
}

export const resetPassword = async (req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const employeeID = req.body.employeeID;
    const otp = req.body.otp;
    const newPassword =req.body.password;
    const confirmNewPassword = req.body.confirmPassword;

    if(!employeeID){
        return res.status(404).json({success: false, message: "Please fill-in your Employee ID# to reset password!"});
    }else if(!otp){
        return res.status(404).json({success: false, message: "Input the OTP codes to reset password!"});
    }else if(!newPassword){
        return res.status(404).json({success: false, message: "Please input your new password!"});
    }else if(newPassword.length<10){
        return res.status(404).json({success: false, message: "Passwords should not be less than 10 characters in length!"});
    }else if(!confirmNewPassword){
        return res.status(404).json({success: false, message: "Please confirm your password!"});
    }else if(newPassword !== confirmNewPassword){
        return res.status(404).json({success: false, message: "Passwords mismatched! Please confirm your password again."});
    }

    try{
        const userData = await User.findOne({"employeeID": employeeID});

        if(!userData){
            res.status(401).json({success: false, message: "Employee Account not found!"});
        }else if(userData.resetOTP === "" || userData.resetOTP !== otp){
            res.status(401).json({success: false, message: "Invalid OTP codes!"});
        }else if(userData.resetOTPExpire <= Date.now()){
            res.status(401).json({success: false, message: "OTP codes are already expired!"});
        }else{
            const salt = Number (process.env.SALT || 10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            userData.password = hashedPassword;
            userData.resetOTP="";
            userData.resetOTPExpire=0;
            
            await User.findByIdAndUpdate(userData._id, userData);

            res.status(200).json({success: true, message: "Password reset successfully!"});
        }

    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }

    return res;
}

export const changePassword = async (req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const newPassword=req.body.password;
    const confirmNewPassword=req.body.confirmPassword;
    const id = req.body._id;

    if(!newPassword || newPassword.length < 10){
        return res.status(404).json({success: false, message: "Invalid new password!"});
    }
    if(!confirmNewPassword){
        return res.status(404).json({success: false, message: "Please confirm new password!"});
    }
    if(newPassword !== confirmNewPassword){
        return res.status(404).json({success: false, message: "Passwords mismatched! Please confirm new password again!"});
    }

    if(!id || !mongoose.isValidObjectId(id)){
        return res.status(401).json({success: false, message: "Invalid Employee Database ID!"});
    }

    const salt = Number (process.env.SALT || 10);
    const session = await mongoose.startSession();
    try{
        const user=await User.findById(id);
        if(!user){
            return res.status(401).json({success: false, message: "Authentication failed!"});
        }

        session.startTransaction();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;

        await User.findByIdAndUpdate(id, user, {new: true, session});
        await session.commitTransaction();
        res.status(200).json({success: true, message: "Password updated successfully!"});
    }catch(error){
        console.log("error changing password: - "+error.message);
        res.status(500).json({success: false, message: "Server Error!\n"+error.message});
        await session.abortTransaction();
    }finally{
        await session.endSession();
    }

    return res;
}

export const getMyInfo = async(req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }
    const id= req.body._id;

    if(!id || !mongoose.isValidObjectId(id)){
        return res.status(401).json({success: false, message: "Authentication failed!"});
    } 

    try{
        const personalInfo = await User.findById(id).select("-password -resetOTPExpire -resetOTP");
        if(!personalInfo){
            return res.status(401).json({success: false, message: "Authentication failed!"});
        }

        res.status(200).json({success: true, data: [personalInfo]});

    }catch(error){
        console.log("Server Error! - "+error.message);
        res.status(500).json({success: false, message: "Server Error!\n"+error.message});
    }

    return res;
}

export const searchEmployees = async(req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const empID =  req.body.employeeID;
    const lName = req.body.lastName;
    const fName = req.body.firstName;
    const mName = req.body.middleName;
    const emailAdd = req.body.emailAddress;
    const add = req.body.address;

    let filter=[];
    
    if(empID != null && empID.toString().length >0){
        filter.push({"employeeID": {$regex: empID.toString(), $options: "i"}});
    }
    
    if(lName != null && lName.length >0){
        filter.push({"lastName":{$regex: lName, $options: "i"}});
    }

    if(fName != null && fName.length > 0){
        filter.push({"firstName":{$regex: fName, $options: "i"}});
    }

    if(mName != null && mName.length > 0){
        filter.push({"middleName":{$regex: mName, $options: "i"}});
    }

    if(emailAdd != null && emailAdd.length > 0){
        filter.push({"emailAddress":{$regex: emailAdd, $options: "i"}});
    }

    if(add != null && add.length > 0){
      filter.push({"address":{$regex: add, $options: "i"}});
    } 
    
    if(filter == null || filter.length <1){
        return res.status(404).json({success: false, message: "No search parameter received!"});
    }

    try{
        const employees = await User.aggregate(
            [
                {
                    $match: {
                      $or: filter
                    }
                },
                {
                    $project:{
                        password: 0,
                        resetOTP: 0,
                        resetOTPExpire: 0
                    }
                }
              ]
        );
        
        
        res.status(200).json({success: true, data: employees});
    }catch(error){
        console.error("Error trying to retrieve Student list! - "+error.message);
        res.status(500).json({success: false, message: "Server Error!\n"+error.message});
    }   

    return res;
}

export const getAllEmployees = async(req, res) =>{

    try{
        const employees = await User.find({}).select("-password -resetOTPExpire -resetOTP");
        if(!employees){
            return res.status(200).json({success: false, message: "No employees registered yet!"});
        }

        res.status(200).json({success: true, data: employees});

    }catch(error){
        console.log("Server Error! - "+error.message);
        res.status(500).json({success: false, message: "Server Error!\n"+error.message});
    }

    return res;
}

export const isOTPCodesCorrect = async (req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const employeeID = req.body.employeeID;
    const otp = req.body.otp;
    
    if(!employeeID){
        return res.status(200).json({success: false, message: "Please fill-in your Employee ID# to reset password!"});
    }else if(!otp){
        return res.status(200).json({success: false, message: "Input the OTP codes to reset password!"});
    }

    try{
        const userData = await User.findOne({"employeeID": employeeID});

        var output = {success: true, message: "OTP codes are valid!"};

        if(!userData){
            output={success: false, message: "Employee Account not found!"};
        }else if(userData.resetOTP === "" || userData.resetOTP !== otp){
            output = {success: false, message: "Invalid OTP codes!"};
        }else if(userData.resetOTPExpire <= Date.now()){
            output={success: false, message: "OTP codes are already expired!"};
        }

        res.status(200).json(output);
        
    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }

    return res;
}