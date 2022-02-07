'use strict'
const Major = use("App/Models/Major");
const StudentDetails = use("App/Models/StudentDetails");
const Database = use("Database");
const Internship = use("App/Models/Internship");
const Application = use("App/Models/Application");
const Comment = use("App/Models/Comments");
const User = use("App/Models/User");
const helpers = use("Helpers");
const env = use("Env");

class StudentController {

    async home({ request, response, auth }) {
        return response.status(200).json({
          status: 200,
          message: "user home screen",
        });
    }
  
    async getAllMajors({ params, auth, request, response }) {
      var category = params.category;
      //const majorsList = await Major.query().where("category", category).fetch();
      const majorsList = await Major.all();
      if (majorsList == null) {
        logger.error("StudentController-getAllMajors, Majors not found");
        return response.status(404).json({
          message: "Majors not found",
        });
      }
      logger.debug(
        "StudentController-getAllMajors, Succesfully retrived majorsList"
      );
  
      return response.json(majorsList);
    }

    async addStudentData({ auth, request, response }) {
      let studentData = request.post();
      let oldData = await StudentDetails.query()
        .where("studentId", studentData.studentId)
        .fetch();
  
      if (oldData.rows.length == 0) {
        try {
          studentData = await StudentDetails.create(studentData);
        } catch (err) {
          logger.error(err);
        }
        return response.ok(studentData);
      } else {
        oldData = await StudentDetails.find(oldData.rows[0].id);
        oldData = _.merge(oldData, studentData);
        await oldData.save();
        logger.debug(
          "StudentController-updateStudentDetails, Succesfully updated student"
        );
        return response.status(200).json("students successfully added");
      }
    }

    async addStudentData({ auth, request, response }) {
      let studentData = request.post();
      let oldData = await StudentDetails.query()
        .where("studentId", studentData.studentId)
        .fetch();
  
      if (oldData.rows.length == 0) {
        try {
          studentData = await StudentDetails.create(studentData);
        } catch (err) {
          logger.error(err);
        }
        return response.ok(studentData);
      } else {
        oldData = await StudentDetails.find(oldData.rows[0].id);
        oldData = _.merge(oldData, studentData);
        await oldData.save();
        logger.debug(
          "StudentController-updateStudentDetails, Succesfully updated student"
        );
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
    const internshiprules = {
      email: "required",
      employerContact: "required",
      employerName: "required",
      city: "required",
      state: "required",
      addressLine1: "required",
    };
    const validation1 = await validate(intershipDetails, internshiprules);

    if (validation1.fails()) {
      return response.badRequest({
        error: {
          status: 401,
          message:
            "bad request, missing some required for internship properties",
          fields: validation1.messages(),
        },
      });
    }
    try {
      internshipData = await Internship.create(intershipDetails);
    } catch (err) {
      logger.error(err);
    }
    applicationData.internshipId = internshipData.id;
    logger.debug(
      "======================================== only intershipDetailsData id"+
      internshipData.id
    );
    const applicationrules = {
      applicationStatus: "required",
      approvedBy: "required",
      studentId: "required",
      facultyId: "required",
      createdBy: "required",
      updatedBy: "required",
      startDate: "required",
      endDate: "required",
      internshipId: "required",
    };
    const validation2 = await validate(applicationData, applicationrules);
    if (validation2.fails()) {
      if (internshipData.id) {
        await Internship.query().where("id", internshipData.id).delete();
      }
      return response.badRequest({
        error: {
          status: 401,
          message:
            "bad request, missing some required for application properties",
          fields: validation2.messages(),
        },
      });
    }
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

      await mail.send(
        `confirmation.edge`,
        {
          firstname: auth.user.firstname,
          lastname: auth.user.lastname,
          applicationId: id,
          status: applicationData.applicationStatus,
        },
        (message) => {
          message
            .to(auth.user.email)
            .cc(coordinatorEmail)
            .from(env.get("MAIL_USERNAME"))
            .subject("Alert! Intership aplication Registartion");
        }
      );

      return response.json(applicationData);
    } catch (err) {
    logger.error(err);    
  }
}

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
logger.error(err);

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

    await mail.send(
      `updateconfirmation.edge`,
      {
        firstname: auth.user.firstname,
        lastname: auth.user.lastname,
        applicationId: applicationData.applicationreferenceId,
        status: applicationData.applicationStatus,
      },
      (message) => {
        message
          .to(auth.user.email)
          .cc(coordinatorEmail)
          .from(env.get("MAIL_USERNAME"))
          .subject("Alert! Intership aplication Registartion");
      }
    );

    return response.json(applicationData);
  } catch (err) {
logger.error(err)    }

  // const savepoint = await trx.transaction();
}
}

module.exports = StudentController
