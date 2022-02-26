"use strict";
const fs = use("fs");
const got = use("got");
const _ = use("lodash");
const util = use("util");
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

const Helpers = use("Helpers");
const config = use("Config");
const Major = use("App/Models/Major");
const StudentDetails = use("App/Models/StudentDetails");
const mail = use("Mail");
const Internship = use("App/Models/Internship");
const Application = use("App/Models/Application");
const User = use("App/Models/User");
const Env = use("Env");
const adminToken = Env.get("ADMIN_TOKEN");
const Comments = use("App/Models/Comments");
const Users = use("App/Models/User");
const helpers = use("Helpers");
const env = use("Env");
const appRoot = helpers.appRoot();
const usersUtil = require(appRoot + "/app/utils/users.js");

const Database = use("Database");

class FacultyController {
  async getInternshipData({ params, auth, request, response }) {
    const applicationDetails = await Application.query()
      .with("users")
      .with("internship")
      .with("student_details")
      .where("facultyId", "=", params.id)
      .fetch();

    //  //  const schedule = await Carousel.query()
    //  .with("course")
    //  .where('programId', params.programId)
    //  .andWhere('termId', params.termId)
    //  .fetch();

    if (applicationDetails == null) {
      logger.error("StudentController-getAllMajors, Majors not found");
      return response.status(404).json({
        message: "Majors not found",
      });
    }
    if (applicationDetails.rows) {
      for (let i = 0; i < applicationDetails.rows.length; i++) {
        applicationDetails.rows[i].filename =
          applicationDetails.rows[i].studentId +
          "_" +
          applicationDetails.rows[i].applicationreferenceId +
          ".pdf";
      }
    }

    logger.debug(
      "StudentController-getAllMajors, Succesfully retrived majorsList"
    );
    return response.json(applicationDetails);
  }

  async updateApplicationStatus({ params, auth, request, response }) {
    let applicationStatusData = request.post();

    let applicationData = await Application.find(params.id);
    if (!applicationData) {
      logger.error("updateApplicationDetils, Application not found");
      return response.status(404).json({
        error: {
          status: 404,
          message: "Student not found",
        },
      });
    }

    applicationStatusData = _.merge(applicationData, applicationStatusData);

    await applicationStatusData.save();
    logger.debug(
      "FacultyController-updateApplicationStatus, Succesfully updated Application"
    );
    return response.status(200).json("Application successfully updated");
  }
  async postComments({ auth, params, request, response }) {
    let Data = request.post();

    let applicationData = await Application.find(Data.applicationId);
    if (!applicationData) {
      logger.error("updateApplicationDetils, Application not found");
      return response.status(404).json({
        error: {
          status: 404,
          message: "application not found",
        },
      });
    }
    let commentsData = {};
    commentsData.applicationId = Data.applicationId;
    commentsData.comments = Data.comments;
    let commentres = await Comments.create(commentsData);
    let semail = await Users.find(applicationData.studentId);

    await mail.send(
      `aboutcomments.edge`,
      {
        firstname: auth.user.firstname,
        lastname: auth.user.lastname,
        applicationId: applicationData.applicationreferenceId,
        status: applicationData.applicationStatus,
      },
      (message) => {
        message
          .to(semail.email)
          .from(env.get("MAIL_USERNAME"))
          .subject("Alert! Intership aplication Updating comments");
      }
    );
    return commentres;
  }

  async getComments({ auth, params, request, response }) {
    const applicationcommentDetails = await Application.query()
      .where("id", "=", params.applicationId)
      .with("comments")
      .fetch();
    if (applicationcommentDetails == null) {
      logger.error("StudentController-getAllMajors, Majors not found");
      return response.status(404).json({
        message: "Majors not found",
      });
    }

    logger.debug(
      "StudentController-getAllMajors, Succesfully retrived majorsList"
    );
    return response.json(applicationcommentDetails);
  }

  async postComments({ auth, params, request, response }) {
    let Data = request.post();

    let applicationData = await Application.find(Data.applicationId);
    if (!applicationData) {
      logger.error("updateApplicationDetils, Application not found");
      return response.status(404).json({
        error: {
          status: 404,
          message: "application not found",
        },
      });
    }
    let commentsData = {};
    commentsData.applicationId = Data.applicationId;
    commentsData.comments = Data.comments;
    let commentres = await Comments.create(commentsData);
    let semail = await Users.find(applicationData.studentId);

    await mail.send(
      `aboutcomments.edge`,
      {
        firstname: auth.user.firstname,
        lastname: auth.user.lastname,
        applicationId: applicationData.applicationreferenceId,
        status: applicationData.applicationStatus,
      },
      (message) => {
        message
          .to(semail.email)
          .from(env.get("MAIL_USERNAME"))
          .subject("Alert! Intership aplication Updating comments");
      }
    );
    return commentres;
  }

  async getFaculty({ auth, request, params, response }) {
    try {
      let faculty = await User.query().where("id", params.id).fetch();
      return response.json(faculty);
    } catch (error) {
      logger.error(error);
    }
  }
  async addFaculty({ auth, request, response, params }) {
    let facultyId = params.id;
    let facultyData = await usersUtil.getUserFromCanvas(facultyId);
    if (!facultyData) {
      logger.error("updateApplicationDetils, Faculty not found");
      return response.status(404).json({
        error: {
          status: 404,
          message: "Faculty not found",
        },
      });
    } else {
      // return response.status(200).json({
      //   message: "Faculty Added successfully",
      // });
      return response.json(facultyData);
    }
  }
}

module.exports = FacultyController;
