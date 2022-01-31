'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StudentdetailsSchema extends Schema {
  up () {
    this.create('student_details', (table) => {
      table.increments()
      table.string('addressLine1',60)
      table.string('addressLine2',60)
      table.string('city',25)
      table.string('state',25)
      table.integer('zipCode',10)
      table.string('contact')
      table.string('majorId')
      table.foreign("majorId").references("majors.major_Id")
      table.integer('studentId').unsigned()
      table.foreign("studentId").references('users.id')
      table.timestamps()
    })
  }
  down () {
    this.drop('student_details')
  }
}

module.exports = StudentdetailsSchema
