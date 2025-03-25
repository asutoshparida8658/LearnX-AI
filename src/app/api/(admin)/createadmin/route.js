import { NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/db";
import Admin from "../../../../../models/Admin";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  try {
    await ConnectDb();
    
    // Get request data
    const reqData = await req.json();
    const { username, name, password, email, linkedin, github, role, masterKey } = reqData;

    // Validate master key for security
    if (masterKey !== process.env.ADMIN_MASTER_KEY) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized: Invalid master key",
        status: 401
      });
    }

    // Check if username already exists
    const existingUsername = await Admin.findOne({ username });
    if (existingUsername) {
      return NextResponse.json({
        success: false,
        message: "Username already exists",
        status: 400
      });
    }

    // Check if email already exists
    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({
        success: false,
        message: "Email already exists",
        status: 400
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = new Admin({
      username,
      name,
      password: hashedPassword,
      email,
      linkedin: linkedin || "",
      github: github || "",
      role: role || "admin",
      isforgot: true
    });

    // Save admin to database
    await newAdmin.save();

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      status: 201
    });
  } catch (err) {
    console.error("Error creating admin:", err);
    return NextResponse.json({
      success: false,
      message: "Error creating admin: " + err.message,
      status: 500
    });
  }
}