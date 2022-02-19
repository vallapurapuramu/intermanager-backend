"use strict";

/*
|--------------------------------------------------------------------------
| MajorSeeder
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

class MajorSeeder {
  async run() {
    const majors = [
      {
        major_id: "MS_ACS",
        majorName: "Applied Computer Science",
        category: "Grad",
      },
      {
        major_id: "MS_IS",
        majorName: "Information Systems",
        category: "Grad",
      },

      {
        major_id: "BUSTECHN_BS",
        majorName: "BUSINESS TECHNOLOGY",
        category: "UnderGrad",
      },

      {
        major_id: "BAS-PSYCHOLOGY",
        majorName: "BAS-Psychology",
        category: "UnderGrad",
      },
      {
        major_id: "GIS",
        majorName: "Geographic Information Science",
        category: "UnderGrad",
      },
    ];
    await Database.insert(majors).into("majors");
  }
}

module.exports = MajorSeeder;
