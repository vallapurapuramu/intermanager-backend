"use strict";

const env = use("Env");
const adminToken = env.get("ADMIN_TOKEN");
const User = use("App/Models/User");
const crypto = require("crypto");

const Securitykey = "82f2ceed4c503896c8a291e560bd4325";
const initVector = "sinasinasisinaaa";
const algorithm = "aes-256-cbc";

class AuthController {
  async logout({ response }) {
    return response.status(200).json({
      status: 200,
      message: "logout successfull",
    });
  }

  // async register({ request, response, auth }) {

  // const data = request.post();
  //     try {
  //               const rules = {
  //                 email: "required",
  //                 password: "required",
  //                 username: "required",
  //             };
  //             const validation = await validate(request.post(), rules);

  //               if (validation.fails()) {
  //                   return response.badRequest({
  //                     error: {
  //                       status: 401,
  //                       message:
  //                         "bad request, missing some required for register properties",
  //                       fields: validation.messages(),
  //                     },
  //                   });

  //             }

  //               await User.create({
  //               email: data.email,
  //               password: data.password,
  //               username: data.username,
  //               role: "user",
  //             });
  //             return response.status(200).json({
  //               message: "Successfully registeredd in the data",
  //             });
  //     } catch (err) {
  //       return response.status(500).json({
  //         message: err,
  //       });
  //     }

  // }

  async login({ request, response, auth }) {
    const userinfo = request.only(["email", "password"]);
    //const userinfo = request.post();
    const rules = {
      email: "required",
      password: "required",
    };

    // const validation = await validate(userinfo, rules);

    // if (validation.fails()) {
    //   return response.badRequest({
    //     error: {
    //       status: 401,
    //       message: "bad request, missing some required for connectcompony",
    //       fields: validation.messages(),
    //     },
    //   });
    // }

    if (!userinfo.email || !userinfo.password) {
      console.error(
        "AuthController-login, missing required attributes: email/password"
      );
      return response.status(400).json({
        error: {
          status: 400,
          message: "bad request, username and code are required",
        },
      });
    }

    const decipher = crypto.createDecipheriv(
      algorithm,
      Securitykey,
      initVector
    );

    let decryptedData = decipher.update(userinfo.password, "base64", "utf-8");

    decryptedData += decipher.final("utf8");

    userinfo.password = decryptedData;

    console.log(userinfo, "here is user details ");
    const user = await User.query()
      .where("email", userinfo.email)
      .where("password", userinfo.password)
      .fetch();
    console.log(user,user.rows,"skfjgdskjfhgduhfgiudgf");
    if (user.rows.length > 0) {
      const user = await User.findBy({ email: userinfo.email });
      console.log(user, "user");
      let jwtToken = await auth.generate(user);
       
      return response.status(200).json({
        message: "authenticated",
        data: user,
        token: jwtToken.token,
      });
    } else {
      return response.status(500).json({
        message: "unauthenticated user",
      });
    }
  }
}

module.exports = AuthController;
