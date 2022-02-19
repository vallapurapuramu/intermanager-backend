"use strict";

/*
|--------------------------------------------------------------------------
| StudentDetailSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Database = use("Database");
const Hash = use("Hash");

class StudentDetailSeeder {
  async run() {
    const student_details = [
      {
        id: 1,
        addressLine1: "1115 N college Dr",
        addressLine2: "Apt 100",
        city: "Maryville",
        state: "MO",
        zipCode: 64468,
        contact: "(123) 456-7890",
        majorId: "MS_ACS",
        studentId: 919603902,
      },
      {
        id: 2,
        addressLine1: "1121 N college Dr",
        addressLine2: "Apt 9",
        city: "Maryville",
        state: "MO",
        zipCode: 64468,
        contact: "(123) 456-7890",
        majorId: "BUSTECHN_BS",
        studentId: 919594197,
      },
    ];
    await Database.insert(student_details).into("student_details");
  }
}

module.exports = StudentDetailSeeder;
