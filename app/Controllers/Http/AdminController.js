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
