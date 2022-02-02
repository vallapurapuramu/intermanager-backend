'use strict'

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
}

module.exports = AdminController

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
