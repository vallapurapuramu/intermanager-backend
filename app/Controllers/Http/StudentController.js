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
    logger.error(err);    }
  }

  async getInternshipData({ params, auth, request, response }) {
    const applicationDetails = await Application.query()
      .where("studentId", "=", params.studentId)
      .with("users")
      .with("internship")
      .with("student_details")
      .fetch();
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

  async getInternshipData({ params, auth, request, response }) {
    const applicationDetails = await Application.query()
      .where("studentId", "=", params.studentId)
      .with("users")
      .with("internship")
      .with("student_details")
      .fetch();
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
  async getPersonalDetails({ params, auth, request, response }) {
    const studentDetails = await User.query()
      .with("student_details")
      .where("id", "=", params.studentId)
      .fetch();

    if (studentDetails == null) {
      logger.error("StudentController-getAllMajors, Majors not found");
      return response.status(404).json({
        message: "Majors not found",
      });
    }

    logger.debug(
      "StudentController-getAllMajors, Succesfully retrived majorsList"
    );
    return response.json(studentDetails);
  }
  async updateInternshipAgreement({ auth, request, response }) {
    let userDetails = request.post();
    var user = await User.find(userDetails.studentId);

    if (!user) {
      logger.error("User not found");
      return response.status(404).json({
        message: "Student not found",
      });
    }
    user.isagreement = 1;
    user.save();
    return response.status(200).json({
      message: "Success",
    });
  }
  async getResume({params, auth, request, response}){
    if (auth.user.role != "faculty" && auth.user.role != "admin") {
      return response.status(401).json({
          message: 'You don\'t have permission'
      })
    } else {
      let path = process.cwd() + '\\resources\\views\\public' 
      let documents = fs.readdirSync(path,  (err, files) => {
        if (err) {
          console.log(err);
          return err;
        }else{
          return files
        }
      });
      try 
      {let filename = documents.find(doc => doc.includes(params.id))
      let file = path + '\\' + filename
      // var filename = path.basename(file);
      // var mimetype = mime.lookup(file);
      response.header('Content-disposition', 'attachment; filename=' + filename);
      response.header('Content-type', 'application/pdf');
      response.download(file)
      } catch(err){console.log(err)}
    }

  }
}

module.exports = StudentController
