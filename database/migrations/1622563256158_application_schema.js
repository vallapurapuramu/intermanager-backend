"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ApplicationSchema extends Schema {
  up() {
    this.create("applications", (table) => {
      table.increments().primary().index("id");
      table.string("applicationreferenceId");
      table.string("applicationStatus", 10);
      table.datetime("applicationDate").defaultTo(this.fn.now());
      table.string("approvedBy", 20);
      table.string("comments");
      table.datetime("startDate");
      table.datetime("endDate");
      table.timestamp("created_at").defaultTo(this.fn.now());
      table.timestamp("updated_at").defaultTo(this.fn.now());
      table.string("createdBy");
      table.string("updatedBy");
      table.boolean("pushNotification").defaultTo(false);
      table.integer("studentId").unsigned().notNullable();
      table.foreign("studentId").references("users.id");
      table.integer("internshipId").unsigned().notNullable();
      table.foreign("internshipId").references("internships.id");
      table.integer("facultyId").unsigned().notNullable();
      table.foreign("facultyId").references("users.id");
    });
  }

  down() {
    this.drop("applications");
  }
}

module.exports = ApplicationSchema;
