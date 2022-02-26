"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MajorSchema extends Schema {
  up() {
    this.create("majors", (table) => {
      table.string("major_Id").primary().notNullable().unique();
      table.string("majorName", 500).notNullable().unique();
      table.string("category").notNullable();
    });
  }

  down() {
    this.dropIfExists("majors");
  }
}
module.exports = MajorSchema;
