import dbConnect from "@/lib/dbConnect";
import UserModel from "@/modal/User";
import bcrypt from "bcryptjs";

import { sendVerficationEmail } from "@/helper/sendVerficationEmail";
import { stat } from "fs";
import { json } from "stream/consumers";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiByUsername) {
      return Response.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }

    const existingUserVerifiByEmail = await UserModel.findOne({
      email,
      // isVerified: true,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserVerifiByEmail) {
    //   true; // Todo: send verification email
    if(existingUserVerifiByEmail.isVerified){
      return Response.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }else{
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserVerifiByEmail.password = hashedPassword;
        existingUserVerifiByEmail.verifyCode = verifyCode;
        existingUserVerifiByEmail.verifiedCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserVerifiByEmail.save();
    }

    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const ExpiresDate = new Date();
      ExpiresDate.setHours(ExpiresDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifiedCodeExpiry: ExpiresDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      })

      await newUser.save();
    }

    //  send verification email
    const emailResponse = await sendVerficationEmail(email,username, verifyCode)
    // console.log(emailResponse)
    //
    if (!emailResponse.success) {
      return Response.json(
        {
          success: true,
          message: "User created successfully",
        },
        { status: 500 }
    
      );

    }

    return Response.json(
        {
          success: true,
          message: "User created successfully",
        }, {
          status: 200
        }
    )

  } catch (error) {
    console.log("Error in Register", error);
    return Response.json(
      {
        success: false,
        message: "Error in Register",
      },
      { status: 500 }
    );
  }
}
