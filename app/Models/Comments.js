'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comments extends Model {
    static get primaryKey() {
        return "id";
}
}

module.exports = Comments
