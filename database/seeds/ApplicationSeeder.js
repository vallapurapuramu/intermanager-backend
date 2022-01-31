'use strict'

/*
|--------------------------------------------------------------------------
| ApplicationSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Database = use("Database");
const Hash = use("Hash");

class ApplicationSeeder {
  async run () {
    const applications = [
      {
        id : 1,
        applicationreferenceId : "APP#000001",
        applicationStatus : "Pending",
        applicationDate:"2021-07-19",
        approvedBy : "Gary", 
        comments : "",
        startDate : "2021-07-19", 
        endDate : "2021-08-17", 
        createdBy : "919603902",
        updatedBy : "919603902",
        studentId : "919603902", 
        internshipId : 1,
        facultyId : 919560972
      },
      {
        id : 2,
        applicationreferenceId : "APP#000002",
        applicationStatus : "Pending",
        applicationDate:"2021-07-19",
        approvedBy : "Gary", 
        comments : "",
        startDate : "2021-07-19", 
        endDate : "2021-08-17", 
        createdBy : "919603902",
        updatedBy : "919603902",
        studentId : "919603902", 
        internshipId : 2,
        facultyId : 919560972
      },
      {
        id : 3,
        applicationreferenceId : "APP#000003",
        applicationStatus : "Pending",
        applicationDate:"2021-07-19",
        approvedBy : "Gary", 
        comments : "",
        startDate : "2021-07-19", 
        endDate : "2021-08-17",  
        createdBy : "919603902",
        updatedBy : "919603902",
        studentId : "919603902", 
        internshipId : 3,
        facultyId : 919560972
      },
      {
        id : 4,
        applicationreferenceId : "APP#000004",
        applicationStatus : "Pending",
        applicationDate:"2021-07-19",
        approvedBy : "Gary", 
        comments : "",
        startDate : "2021-07-19", 
        endDate : "2021-08-17", 
        createdBy : "919603902",
        updatedBy : "919603902",
        studentId : "919603902", 
        internshipId : 4,
        facultyId : 919560972
      },
    ];
    await Database.insert(applications).into("applications");
  }
}

module.exports = ApplicationSeeder
