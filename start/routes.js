"use strict";

const FacultyController = require("../app/Controllers/Http/FacultyController");
const StudentController = require("../app/Controllers/Http/StudentController");

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.group(() => {
  Route.post("login", "AuthController.login");
  Route.get("logout", "AuthController.logout");
}).prefix("/imapi/api/auth");

Route.group(() => {
  Route.get("home", "StudentController.home");
  Route.get("majors", "StudentController.getAllMajors");
  Route.post("student/studentdata", "StudentController.addStudentData");
  Route.get("admins", "AdminController.getAllAdmins");
  Route.get("applications", "AdminController.getAllApplications");
  Route.delete("admins/:adminId", "AdminController.deleteAdmin");
  Route.post(
    "student/applicationdata",
    "StudentController.addInternshipApplication"
  );
  Route.get("applications/:id", "FacultyController.getInternshipData");

  Route.get(
    "student/applications/:studentId",
    "StudentController.getInternshipData"
  );
  Route.patch(
    "student/updateapplicationdata/:id",
    "StudentController.updateInternshipApplication"
  );
  Route.delete(
    "student/deleteapplicationdata/:id",
    "StudentController.deleteInternshipApplication"
  );
  Route.get(
    "student/personalDetails/:studentId",
    "StudentController.getPersonalDetails"
  );
  Route.patch(
    "student/updateInternshipAgreement",
    "StudentController.updateInternshipAgreement"
  );
  Route.patch(
    "update-applications-status/:id",
    "FacultyController.updateApplicationStatus"
  );
  Route.get("student/comments/:applicationId", "FacultyController.getComments");
  Route.post("student/comments", "FacultyController.postComments");
  Route.get("verifyfaculty/:id", "FacultyController.getFaculty");
  // Route.post("faculty/addFaculty/:id", "FacultyController.addFaculty");
  Route.get("application/:id", "StudentController.getResume");
}).prefix("/imapi/api/");
