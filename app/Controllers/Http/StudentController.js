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
}

module.exports = StudentController
