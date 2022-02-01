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
      
}

module.exports = StudentController
