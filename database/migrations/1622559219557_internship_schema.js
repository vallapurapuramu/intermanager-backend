'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class InternshipSchema extends Schema {
  up () {
    this.create('internships', (table) => {
      table.increments().primary().index('id')
      table.string('employerName', 80).notNullable()
      table.string('primaryContactName', 80).notNullable()
      table.string('email').notNullable()
      table.string('duration', 10).notNullable()
      table.string('employerContact', 60)
      table.string('addressLine1',60)
      table.string('addressLine2',60)
      table.string('city',25)
      table.string('state')
      table.integer('zipCode',10)
      table.timestamps()
    })
  }

  down () {
    this.drop('internships')
  }
}

module.exports = InternshipSchema
