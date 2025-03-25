import { NextResponse } from "next/server"
import ConnectDb from "../../../../middleware/db";
import Users from "../../../../models/Users";
import Otp from "../../../../models/Otp";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import Auth from "../../../../models/Auth";

export const POST = async(req, res) => {
  let reqdata = await req.json();
  
  // If type is send then send otp to email
  if (reqdata.type == "send") {
    try {
      const transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.NEXT_PUBLIC_EMAIL_USER_NAME,
          pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
        }
      });
      
      // Connect to database
      await ConnectDb();
      
      // Delete previous OTP if exists
      await Otp.deleteOne({ email: reqdata.email });
      
      // Generate new OTP
      let otp = Math.floor(100000 + Math.random() * 900000);
      
      // Save OTP to database
      await Otp.create({ email: reqdata.email, otp: otp });
      
      // Check if user exists
      let existingUser = await Users.findOne({ email: reqdata.email });
      let userName = existingUser ? existingUser.name : "User";
      
      // Send OTP email
      const info = await transporter.sendMail({
        from: 'team@devsomeware.com',
        to: reqdata.email,
        subject: `Your Learn-Devsomeware Login OTP: Secure Access Code Inside`,
        html: `
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">Login Verification</h1>
                </div>
                <div style="padding: 20px;">
                    <p>Dear ${userName},</p>
                    <p>Thank you for using our LMS. To complete your ${existingUser ? 'login' : 'registration'}, please use the following One-Time Password (OTP):</p>
                    <div style="font-size: 24px; font-weight: bold; color: #333333; text-align: center; margin: 20px 0;">${otp}</div>
                    <p>This OTP is valid for the next 10 minutes. Please do not share this OTP with anyone for security reasons.</p>
                    <p>If you did not request this OTP, please ignore this email.</p>
                    <p>Best regards,<br/>The Learn.devsomeware Team</p>
                </div>
                <div style="background-color: #f4f4f4; color: #888888; padding: 20px; text-align: center; font-size: 14px;">
                    <p>© ${new Date().getFullYear()} learn.devsomeware.com, All rights reserved.</p>
                    <p>If you have any questions, contact us at <a href="mailto:support@devsomeware.com" style="color: #007bff; text-decoration: none;">support@devsomeware.com</a>.</p>
                </div>
            </div>
        </body>
        `,
      });

      return NextResponse.json({
        message: "OTP sent to your email",
        success: true,
        isNewUser: !existingUser
      });
    } catch (err) {
      console.log(err);
      return NextResponse.json({
        message: "Something went wrong: " + err,
        success: false
      });
    }
  }
  // If type is verify then verify otp and handle user login/signup
  else if (reqdata.type == "verify") {
    try {
      // Find OTP in database
      let otpdata = await Otp.findOne({
        email: reqdata.email,
        otp: reqdata.otp
      });
      
      // If OTP is valid
      if (otpdata) {
        // Check if user exists
        let existingUser = await Users.findOne({ email: reqdata.email });
        
        if (existingUser) {
          // User exists - handle login
          let token = jwt.sign(
            {
              email: reqdata.email,
              id: existingUser._id,
              name: existingUser.name
            },
            process.env.JWT_SECRET
          );
          
          // Delete previous auth data
          await Auth.deleteOne({ email: reqdata.email });
          
          // Create new auth data
          let authc = await Auth.create({
            email: reqdata.email,
            userid: existingUser._id,
            name: existingUser.name,
            token: token
          });
          
          return NextResponse.json({
            success: true,
            message: "Login successful",
            token: token
          });
        } else {
          // User doesn't exist - handle registration
          if (!reqdata.registrationData) {
            return NextResponse.json({
              success: false,
              message: "Registration data required for new user",
              requiresRegistration: true
            });
          }
          
          // Create new user with registration data
          const { name, github, linkedin } = reqdata.registrationData;
          
          let newUser = new Users({
            name,
            email: reqdata.email,
            password: Math.random().toString(36).slice(-8), // Generate a random password
            github: github || "",
            linkedin: linkedin || ""
          });
          
          await newUser.save();
          
          // Generate token for new user
          let token = jwt.sign(
            {
              email: reqdata.email,
              id: newUser._id,
              name: newUser.name
            },
            process.env.JWT_SECRET
          );
          
          // Create auth entry
          let authc = await Auth.create({
            email: reqdata.email,
            userid: newUser._id,
            name: newUser.name,
            token: token
          });
          
          return NextResponse.json({
            success: true,
            message: "Registration and login successful",
            token: token
          });
        }
      } else {
        // Invalid OTP
        return NextResponse.json({
          success: false,
          message: "Invalid OTP"
        });
      }
    } catch (err) {
      console.log(err);
      return NextResponse.json({
        success: false,
        message: "Something went wrong: " + err
      });
    }
  } else {
    return NextResponse.json({
      success: false,
      message: "Invalid request type"
    });
  }
}