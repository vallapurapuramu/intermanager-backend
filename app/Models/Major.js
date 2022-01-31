'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Major extends Model {
    static get primaryKey() {
        return "id";
    }
    // student_details () {
    //     return this.hasMany('App/Models/StudentDetails')
    //   }
   
}

module.exports = Major
