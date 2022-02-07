'use strict'

class FacultyController {
    async getInternshipData({ params, auth, request, response }) {
    const applicationDetails = await Application.query()
      .with("users")
      .with("internship")
      .with("student_details")
      .where("facultyId", "=", params.id)
      .fetch();

    //  //  const schedule = await Carousel.query()
    //  .with("course")
    //  .where('programId', params.programId)
    //  .andWhere('termId', params.termId)
    //  .fetch();

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

}

module.exports = FacultyController
