'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class InternshipAgreement extends Model {
    static get primaryKey() {
        return "id";
    }
}

module.exports = InternshipAgreement
