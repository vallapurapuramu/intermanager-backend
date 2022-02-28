"use strict";
const _ = use("lodash");
const Major = use("App/Models/Major");
const StudentDetails = use("App/Models/StudentDetails");
const mail = use("Mail");
const Internship = use("App/Models/Internship");
const Application = use("App/Models/Application");
const User = use("App/Models/User");
const Comments = use("App/Models/Comments");
const Users = use("App/Models/User");
const env = use("Env");
const Database = use("Database");

class FacultyController {
  async getInternshipData({ params, auth, request, response }) {
    const applicationDetails = await Application.query()
      .with("users")
      .with("internship")
      .with("student_details")
      .where("facultyId", "=", params.id)
      .fetch();
    if (applicationDetails == null) {
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
    return response.json(applicationDetails);
  }

  async updateApplicationStatus({ params, auth, request, response }) {
    let applicationStatusData = request.post();

    let applicationData = await Application.find(params.id);
    if (!applicationData) {
      return response.status(404).json({
        error: {
          status: 404,
          message: "Student not found",
        },
      });
    }

    applicationStatusData = _.merge(applicationData, applicationStatusData);

    await applicationStatusData.save();
    return response.status(200).json("Application successfully updated");
  }
  async postComments({ auth, params, request, response }) {
    let Data = request.post();

    let applicationData = await Application.find(Data.applicationId);
    if (!applicationData) {
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
      return response.status(404).json({
        message: "Majors not found",
      });
    }
    return response.json(applicationcommentDetails);
  }

  async postComments({ auth, params, request, response }) {
    let Data = request.post();

    let applicationData = await Application.find(Data.applicationId);
    if (!applicationData) {
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
      let faculty = await User.query().where("email", params.id).fetch();
      return response.json(faculty);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = FacultyController;
