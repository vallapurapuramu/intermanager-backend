'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Application extends Model {
    static get primaryKey() {
        return "id";
    }
    internship() {
        return this.hasOne("App/Models/Internship", "internshipId", "id");
    }
    users() {
        return this.hasMany("App/Models/User", "studentId", "id");
    }

    comments() {
        return this.hasMany("App/Models/Comments", "id", "applicationId");
    }

    student_details() {
        return this.hasOne("App/Models/StudentDetails", "studentId", "studentId");
    }

}

module.exports = Application
