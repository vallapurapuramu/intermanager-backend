"use strict";
const fs = use("fs");
const _ = use("lodash");
const util = use("util");
const Helpers = use("Helpers");
const Major = use("App/Models/Major");
const StudentDetails = use("App/Models/StudentDetails");
const Database = use("Database");
const Internship = use("App/Models/Internship");
const Application = use("App/Models/Application");
const Comment = use("App/Models/Comments");
const User = use("App/Models/User");
const appRoot = Helpers.appRoot();
// const mail = use("Mail");
const env = use("Env");

const usersUtil = require(appRoot + "/app/utils/users.js");
const coordinatorEmail = "s541910@nwmissouri.edu";

class StudentController {
  async home({ request, response, auth }) {
    return response.status(200).json({
      status: 200,
      message: "user home screen",
    });
  }

  async getAllMajors({ params, auth, request, response }) {
    var category = params.category;
    const majorsList = await Major.all();
    if (majorsList == null) {
      console.error("StudentController-getAllMajors, Majors not found");
      return response.status(404).json({
        message: "Majors not found",
      });
    }
    console.debug(
      "StudentController-getAllMajors, Succesfully retrived majorsList"
    );

    return response.json(majorsList);
  }

  async addStudentData({ auth, request, response }) {
    let studentData = request.post();
    console.log(studentData, "dskhbfibfd");
    let oldData = await StudentDetails.query()
      .where("studentId", studentData.studentId)
      .fetch();

    if (oldData.rows.length == 0) {
      try {
        studentData = await StudentDetails.create(studentData);
      } catch (err) {
        console.error(err);
      }
      return response.ok(studentData);
    } else {
      oldData = await StudentDetails.find(oldData.rows[0].id);
      oldData = _.merge(oldData, studentData);
      await oldData.save();

      return response.status(200).json("students successfully added");
    }
  }

  async addInternshipApplication({ auth, request, response }) {
    let internshipData = request.post();
    let facultyInfo = await usersUtil.getUserSearch(internshipData.facultyId);
    if (!facultyInfo) {
      return response.badRequest({
        error: {
          status: 401,
          message:
            "Faculty with email " + internshipData.facultyEmail + "don't exist",
        },
      });
    }
    let applicationData = {};
    let intershipDetails = {};
    applicationData.applicationStatus = internshipData.applicationStatus;
    applicationData.applicationDate = internshipData.applicationDate;
    applicationData.approvedBy = internshipData.firstName;
    applicationData.comments = internshipData.comments;
    applicationData.startDate = internshipData.startDate;
    applicationData.endDate = internshipData.endDate;
    applicationData.pushNotification = internshipData.pushNotification;
    applicationData.studentId = internshipData.studentId;
    applicationData.facultyId = internshipData.facultyId;
    applicationData.createdBy = auth.user.id;
    applicationData.updatedBy = auth.user.id;
    intershipDetails.employerName = internshipData.employerName;
    intershipDetails.primaryContactName = internshipData.primaryContactName;
    intershipDetails.email = internshipData.email;

    const date1 = new Date(internshipData.startDate);
    const date2 = new Date(internshipData.endDate);
    const diffInMs = Math.abs(date2 - date1);
    const diff = diffInMs / (1000 * 60 * 60 * 24);
    intershipDetails.duration = diff;
    intershipDetails.employerContact = internshipData.employerContact;
    intershipDetails.addressLine1 = internshipData.addressLine1;
    intershipDetails.addressLine2 = internshipData.addressLine2;
    intershipDetails.city = internshipData.city;
    intershipDetails.state = internshipData.state;
    intershipDetails.zipCode = internshipData.zipCode;
    try {
      internshipData = await Internship.create(intershipDetails);
    } catch (err) {
      console.error(err);
    }
    applicationData.internshipId = internshipData.id;

    try {
      applicationData = await Application.create(applicationData);
      var id = applicationData.id + "";
      var len = 6 - id.length;
      id = "APPNO" + "0".repeat(len) + id;
      applicationData.applicationreferenceId = id;
      applicationData.save();
      const profilePic = request.file("offerletter", {
        maxSize: "5mb",
        allowedExtensions: ["pdf"],
      });

      await profilePic.move(Helpers.viewsPath("public/"), {
        name: applicationData.studentId + "_" + id + ".pdf",
        overwrite: true,
      });

      if (!profilePic.moved()) {
        return profilePic.error();
      }

      // await mail.send(
      //   `confirmation.edge`,
      //   {
      //     firstname: auth.user.firstname,
      //     lastname: auth.user.lastname,
      //     applicationId: id,
      //     status: applicationData.applicationStatus,
      //   },
      //   (message) => {
      //     message
      //       .to(auth.user.email)
      //       .cc(coordinatorEmail)
      //       .from(env.get("MAIL_USERNAME"))
      //       .subject("Alert! Intership aplication Registartion");
      //   }
      // );

      return response.json(applicationData);
    } catch (err) {
      console.error(err);
    }
  }

  async getInternshipData({ params, auth, request, response }) {
    const applicationDetails = await Application.query()
      .where("studentId", "=", params.studentId)
      .with("users")
      .with("internship")
      .with("student_details")
      .fetch();
    if (applicationDetails == null) {
      console.error("StudentController-getAllMajors, Majors not found");
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

  async getInternshipData({ params, auth, request, response }) {
    const applicationDetails = await Application.query()
      .where("studentId", "=", params.studentId)
      .with("users")
      .with("internship")
      .with("student_details")
      .fetch();
    if (applicationDetails == null) {
      console.error("StudentController-getAllMajors, Majors not found");
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

  async deleteInternshipApplication({ auth, request, response, params }) {
    //Checking if the user has authorization
    if (auth.user.role != "faculty" && auth.user.role != "admin") {
      return response.status(401).json({
        message: "You don't have permission",
      });
    } else {
      //Deleting the application
      const comment = await Comment.query()
        .where("applicationId", params.id)
        .delete()
        .then((response) => {
          return response.status(200).json({ message: "Comments deleted" });
        })
        .catch((err) => {
          return err;
        });

      const application = await Application.query()
        .where("id", params.id)
        .delete()
        .then((response) => {
          return response.status(200).json({ message: "Application deleted" });
        })
        .catch((err) => {
          return err;
        });

      const internship = await Internship.query()
        .where("id", params.id)
        .delete()
        .then((response) => {
          return response.status(200).json({ message: "Internship deleted" });
        })
        .catch((err) => {
          return err;
        });

      return [application, internship];
    }
  }

  /**
   * Post application Info
   */
  async updateInternshipApplication({ auth, request, response, params }) {
    var id = params.id;
    let internshipData = request.post();
    var applicationData = await Application.find(id);
    var intershipDetails = await Internship.find(applicationData.internshipId);
    let facultyInfo = await usersUtil.getUserSearch(internshipData.facultyId);
    if (!applicationData) {
      return response.badRequest({
        error: {
          status: 401,
          message: " There is no application with is given id",
        },
      });
    }
    if (!intershipDetails) {
      return response.badRequest({
        error: {
          status: 401,
          message: "There is no intership with given id",
        },
      });
    }

    if (!facultyInfo) {
      return response.badRequest({
        error: {
          status: 401,
          message:
            "Faculty with email " + internshipData.facultyEmail + "don't exist",
        },
      });
    }
    // let facultyDetails = {};

    applicationData.applicationStatus = internshipData.applicationStatus;
    applicationData.applicationDate = internshipData.applicationDate;
    applicationData.approvedBy = internshipData.approvedBy;
    applicationData.comments = internshipData.comments;
    // applicationData.satrtDate = internshipData.startDate;
    applicationData.startDate = internshipData.startDate;
    applicationData.endDate = internshipData.endDate;
    applicationData.pushNotification = internshipData.pushNotification;
    // applicationData.studentId = internshipData.studentId;
    applicationData.studentId = internshipData.studentId;

    applicationData.facultyId = internshipData.facultyId;
    applicationData.createdBy = auth.user.id;
    applicationData.updatedBy = auth.user.id;
    // intershipDetails.id =  1;
    intershipDetails.employerName = internshipData.employerName;
    intershipDetails.primaryContactName = internshipData.primaryContactName;
    intershipDetails.email = internshipData.email;
    intershipDetails.duration = internshipData.duration;
    intershipDetails.employerContact = internshipData.employerContact;
    intershipDetails.addressLine1 = internshipData.addressLine1;
    intershipDetails.addressLine2 = internshipData.addressLine2;
    intershipDetails.city = internshipData.city;
    intershipDetails.state = internshipData.state;
    intershipDetails.zipCode = internshipData.zipCode;

    // const trx = await Database.transaction();
    try {
      await intershipDetails.save();
    } catch (err) {
      console.error(err);
    }

    try {
      await applicationData.save();
      id = applicationData.id + "";
      var len = 6 - id.length;
      id = "APPNO" + "0".repeat(len) + id;
      const profilePic = request.file("offerletter", {
        maxSize: "5mb",
        allowedExtensions: ["pdf"],
      });

      await profilePic.move(Helpers.viewsPath("public/"), {
        name: applicationData.studentId + "_" + id + ".pdf",
        overwrite: true,
      });

      if (!profilePic.moved()) {
        return profilePic.error();
      }

      return response.json(applicationData);
    } catch (err) {
      console.error(err);
    }

    // const savepoint = await trx.transaction();
  }

  async getPersonalDetails({ params, auth, request, response }) {
    const studentDetails = await User.query()
      .with("student_details")
      .where("id", "=", params.studentId)
      .fetch();

    if (studentDetails == null) {
      console.error("StudentController-getAllMajors, Majors not found");
      return response.status(404).json({
        message: "Majors not found",
      });
    }

    return response.json(studentDetails);
  }
  async updateInternshipAgreement({ auth, request, response }) {
    let userDetails = request.post();
    var user = await User.find(userDetails.studentId);

    if (!user) {
      console.error("User not found");
      return response.status(404).json({
        message: "Student not found",
      });
    }
    user.save();
    return response.status(200).json({
      message: "Success",
    });
  }
  async getResume({ params, auth, request, response }) {
    if (auth.user.role != "faculty" && auth.user.role != "admin") {
      return response.status(401).json({
        message: "You don't have permission",
      });
    } else {
      let path = process.cwd() + "\\resources\\views\\public";
      let documents = fs.readdirSync(path, (err, files) => {
        if (err) {
          console.log(err);
          return err;
        } else {
          return files;
        }
      });
      try {
        let filename = documents.find((doc) => doc.includes(params.id));
        let file = path + "\\" + filename;
        // var filename = path.basename(file);
        // var mimetype = mime.lookup(file);
        response.header(
          "Content-disposition",
          "attachment; filename=" + filename
        );
        response.header("Content-type", "application/pdf");
        response.download(file);
      } catch (err) {
        console.log(err);
      }
    }
  }
}

module.exports = StudentController;
