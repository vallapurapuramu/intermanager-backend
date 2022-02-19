"use strict";

const Application = use("App/Models/Application");
const Internship = use("App/Models/Internship");
const StudentDetails = use("App/Models/StudentDetails");
// const Major = use('App/Models/Major')
const User = use("App/Models/User");
const winston = require("winston");
const logConfiguration = {
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

const _ = use("lodash");
const Database = use("Database");
const helpers = use("Helpers");
const appRoot = helpers.appRoot();
const usersUtil = require(appRoot + "/app/utils/users.js");

class AdminController {
  async getAllAdmins({ auth, request, response }) {
    const adminsList = await User.query().where("role", "=", "admin").fetch();

    if (adminsList == null) {
      logger.error("AdminController-getAllAdmins, Admins not found");
      return response.status(404).json({
        message: "Admins not found",
      });
    }

    logger.debug("Admin-getAllAdmins, Succesfully retrived adminsList");
    return response.json(adminsList);
  }

  async getAllApplications({ auth, request, response }) {
    const applicationsList = await Application.query()
      .with("users")
      .with("internship")
      .with("student_details")
      .fetch();

    if (applicationsList == null) {
      logger.error(
        "AdminController-getAllApplications, Applications not found"
      );
      return response.status(404).json({
        message: "Applications not found",
      });
    }

    logger.debug(
      "AdminController-getAllApplications, Succesfully retrived applicationsList"
    );
    return response.json(applicationsList);
  }

  async deleteAdmin({ params, response }) {
    const admin = await User.find(params.adminId);
    // const admin = await User.query()
    // .where("role", "=", "admin")
    // .where("id","=",params.adminId)
    // .fetch();

    if (!admin) {
      return response.notFound({
        status: 404,
        message: "Admin not found",
      });
    } else {
      await admin.delete();
    }
    return response.ok({
      status: 200,
      message: "Admin deleted successfully",
    });
  }
}

module.exports = AdminController;
