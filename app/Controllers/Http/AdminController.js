"use strict";
const Application = use("App/Models/Application");
const Internship = use("App/Models/Internship");
const StudentDetails = use("App/Models/StudentDetails");
const User = use("App/Models/User");
const Database = use("Database");


class AdminController {
  async getAllAdmins({ auth, request, response }) {
    const adminsList = await User.query().where("role", "=", "admin").fetch();

    if (adminsList == null) {
      return response.status(404).json({
        message: "Admins not found",
      });
    } 
    return response.json(adminsList);
  }

  async getAllApplications({ auth, request, response }) {
    const applicationsList = await Application.query()
      .with("users")
      .with("internship")
      .with("student_details")
      .fetch();
    if (applicationsList == null) {
      return response.status(404).json({
        message: "Applications not found",
      });
    }
    return response.json(applicationsList);
  }

  async deleteAdmin({ params, response }) {
    const admin = await User.find(params.adminId);
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
