"use strict";
const env = use("Env");
const adminToken = env.get("ADMIN_TOKEN");
const User = use("App/Models/User");
const crypto = require("crypto");
const Encryption = use("Encryption");
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

  async userregister({ request, response, auth }) {
    const data = request.post();
    console.log("khfba", data);
    try {
      const rules = {
        email: "required",
        repassword: "required",
        username: "required",
        firstname: "required",
        lastname: "required",
        password: "required",
      };

      //  const cipher = crypto.AES.encrypt(data.password, CryptoJS.enc.Utf8.parse(Securitykey), {
      //    initVector: crypto.enc.Utf8.parse(initVector),
      //     mode: crypto.mode.CBC
      //   });

      // const cipher = crypto.createCipheriv(
      //   algorithm,
      //   Securitykey,
      //   initVector
      // );

      // mystr += mykey.final('hex');

      // let encryptedData = cipher.update(data.password, "base64", "utf-8");

      // var mystr = encryptedData.update('abc', 'utf8', 'hex')

      // encryptedData += cipher.final("utf8");

      // //data.password = encryptedData.toString();

      //  data.password = encryptedData.toString();

      await User.create({
        email: data.email,
        password: data.password,
        username: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        role: "user",
      });
      return response.status(200).json({
        message: "Successfully registered",
      });
    } catch (err) {
      return response.status(500).json({
        message: err,
      });
    }
  }

  async login({ request, response, auth }) {
    const userinfo = request.only(["email", "password"]);
    //const userinfo = request.post();
    const rules = {
      email: "required",
      password: "required",
    };
    if (!userinfo.email || !userinfo.password) {
      console.error(
        "AuthController-login, missing required attributes: email/password"
      );
      return response.status(400).json({
        error: {
          status: 400,
          message: "bad request, username and password are required",
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

    const user = await User.query()
      .where("email", userinfo.email)
      .where("password", userinfo.password)
      .fetch();
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
