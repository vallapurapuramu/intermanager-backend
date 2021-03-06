"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", (table) => {
      table.increments().primary().unsigned().index("id");
      table.string("username", 80).notNullable().unique();
      table.string("firstname").notNullable();
      table.string("lastname").notNullable();
      table.string("email", 254).notNullable().unique();
      table.string("password", 60);
      table.string("role", 10).notNullable();
      table.boolean("public").notNullable().defaultTo(0);
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
