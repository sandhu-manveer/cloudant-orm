'use strict';

/**
 * @file cloudant init
 */
const Cloudant = require('cloudant');

class CloudantORM {
    constructor(options) {
        this.options = options;
        this.cloudantConnector = Cloudant(options);
    }

    initialize(options) {
        options = options || this.options;
        this.cloudantConnector = Cloudant(options);
    }

    listDataBases(callback) {
        this.cloudantConnector.db.list((err, allDbs) => {
            if(err) callback(err, null);
            else callback(null, allDbs);
        });
    }
}

module.exports = CloudantORM;
