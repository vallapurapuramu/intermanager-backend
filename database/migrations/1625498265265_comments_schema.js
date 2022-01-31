"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CommentsSchema extends Schema {
  up() {
    this.create("comments", (table) => {
      table.increments();
      table.string("comments", 120);
      table.integer("applicationId").unsigned().notNullable();
      table.foreign("applicationId").references("applications.id");
      table.timestamps();
    });
  }

  down() {
    this.drop("comments");
  }
}

module.exports = CommentsSchema;
