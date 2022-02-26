"use strict";

/*
|--------------------------------------------------------------------------
| InternshipSeeder
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

class InternshipSeeder {
  async run() {
    const internships = [
      {
        id: 1,
        employerName: "TCS",
        primaryContactName: "Saikiran",
        email: "v@gmail.com",
        duration: "06",
        employerContact: "(123) 456-7890",
        addressLine1: "621 East 7 th Street",
        addressLine2: "Apt 7",
        city: "Maryville",
        state: "Missouri",
        zipCode: 64468,
      },
      {
        id: 2,
        employerName: "Mindtree",
        primaryContactName: "Sharada",
        email: "ramu@gmail.com",
        duration: "10",
        employerContact: "(123) 456-7890",
        addressLine1: "621 East 7 th Street",
        addressLine2: "Apt 7",
        city: "Texas",
        state: "Texas",
        zipCode: 75014,
      },
      {
        id: 3,
        employerName: "Wells Fargo",
        primaryContactName: "Ramu",
        email: "saikiran@gmail.com",
        duration: "19",
        employerContact: "(123) 456-7890",
        addressLine1: "345 East 21 th Street",
        addressLine2: "Apt 17",
        city: "Maryville",
        state: "Missouri",
        zipCode: 64468,
      },
      {
        id: 4,
        employerName: "Infosys",
        primaryContactName: "Varshith",
        email: "sharada@gmail.com",
        duration: "19",
        employerContact: "(123) 456-7890",
        addressLine1: "1201 S. Joyce Street",
        addressLine2: "Suite C",
        city: "Richmond",
        state: "Virginia",
        zipCode: 23218,
      },
    ];
    await Database.insert(internships).into("internships");
  }
}

module.exports = InternshipSeeder;
