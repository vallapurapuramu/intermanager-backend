"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class StudentDetails extends Model {
  static get primaryKey() {
    return "id";
  }

  // users() {
  //     return this.hasOne("App/Models/User","studentId","id");
  //   }

  majors() {
    return this.hasOne("App/Models/Major", "majorId", "major_Id");
  }
}

module.exports = StudentDetails;
