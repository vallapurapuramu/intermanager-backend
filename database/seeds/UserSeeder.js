"use strict";

/*
|--------------------------------------------------------------------------
| UserSeeder
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

class UserSeeder {
  async run() {
    const users = [
      

      {
        id: 919603902,
        username: "s542263",
        firstname: "varshith reddy",
        lastname: "bairy",
        email: "s542263@nwmissouri.edu",
        password: null,
        role: "user",
        isagreement : false,
        public: false,
      },
      {
        id: 919560972,
        username: "zhao",
        firstname: "Gary",
        lastname: "Zhao",
        email: "zhao@nwmissouri.edu",
        password: null,
        role: "faculty",
        isagreement : true ,
        public: false,
      },
      {
        id: 919594197,
        username: "s541910",
        firstname: "Ramu",
        lastname: "Vallapurapu",
        email: "s541910@nwmissouri.edu",
        password: null,
        role: "admin",
        isagreement : true ,
        public: false,
      },
    ]
    await Database.insert(users).into("users");
  }
}

module.exports = UserSeeder;
