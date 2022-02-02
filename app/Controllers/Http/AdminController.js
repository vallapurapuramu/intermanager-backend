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

async deleteAdmin({ params, response }) {
  const admin = await User.find(params.adminId);
  // const admin = await User.query()
  // .where("role", "=", "admin")
  // .where("id","=",params.adminId)
  // .fetch();

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

module.exports = AdminController

