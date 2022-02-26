"use strict";

const { AdminLimitExceededError } = require("ldapjs");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const _ = use("lodash");
const activeDirectory = use("activedirectory");
const async = use("async");
const config = use("Config");
const winston = require("winston");
const logConfiguration = {
  levels: winston.config.npm.levels,

  transports: [
    new winston.transports.File({
      filename: "logs/application.log",
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    winston.format.printf(
      (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
    )
  ),
};
const logger = winston.createLogger(logConfiguration);

const promise = use("bluebird");
const env = use("Env");
const adminToken = env.get("ADMIN_TOKEN");
const canvasBaseUrl = config.get("app.canvas.globalhost");
const got = use("got");
const util = use("util");
const User = use("App/Models/User");
const crypto = require("crypto");
const initVector = env.get("INIT_VECTOR");
const Securitykey = env.get("SECRET_KEY");

const algorithm = "aes-256-cbc";
class AuthController {


async register({ request, response, auth }) {

const data = request.post();
    console.log(data);
    try {
      const rules = {
        email: "required",
        code: "required",
        username: "required",
      };
       const validation = await validate(request.post(), rules);

        if (validation.fails()) {
        return response.badRequest({
          error: {
            status: 401,
            message:
              "bad request, missing some required for register properties",
            fields: validation.messages(),
          },
        });
      }

        await User.create({
        email: data.email,
        code: data.code,
        username: data.username,
        role: "user",
      });
      return response.status(200).json({
        message: "Successfully registeredd in the data",
      });
    } catch (err) {
      return response.status(500).json({
        message: err,
      });
    }





  async login({ request, response, auth }) {
    const userInfo = request.only(["email", "password"]);   
const rules = {
      username: "required",
      password: "required",
    };

    const validation = await validate(userinfo, rules);

    if (validation.fails()) {
      return response.badRequest({
        error: {
          status: 401,
          message: "bad request, missing some required for connectcompony",
          fields: validation.messages(),
        },
      });
    }



if (!userinfo.username || !userinfo.code) {
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

    let decryptedData = decipher.update(userInfo.password, "base64", "utf-8");

    decryptedData += decipher.final("utf8");

    userInfo.password = decryptedData;
   const user = await User.query()
      .where("username", userinfo.username)
      .where("password", userinfo.code)
      .fetch();

    if (user.rows.length > 0) {
      const user = await User.findBy({ username: userinfo.username });
      console.log("--------------------", user);
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
};

module.exports = AuthController;
