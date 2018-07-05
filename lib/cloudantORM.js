'use strict';

/**
 * @file cloudant init
 */
const Cloudant = require('cloudant');
const _ = require('lodash');

class CloudantORM {
    constructor(options) {
        this.options = options;
        this.cloudantConnector = Cloudant(options);
        this.schemas = {};
        this.models = {};
    }

    sanitize(schema, data) {
        data = data || {};
        return _.pick(_.defaults(data, schema), _.keys(schema));
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

    add_model(model_name, schema) {
        
        if(!this.models[model_name]) this.models[model_name] = {};

        this.models[model_name].schema = schema;
        this.cloudantConnector.db.list((err, allDbs) => {
            let db_name = _.find(allDbs, dbName => dbName === model_name);
            if(!db_name) {
                this.cloudantConnector.db.create(db_name, () => {
                    console.log(db_name + ' created');
                });
            }
        });
        return this;
    }

    getModelByName(model_name) {
        return this.models[model_name];
    }

    update(model_name, data, callback) {

        if (!this.models[model_name]) throw Error('Model ' + model_name + ' not defined');

        const self = this;
        self.data = self.sanitize(data, this.models[model_name].schema);
        self.data.verified = false;
        delete self.data._rev;

        const db_connector = this.cloudantConnector.use(model_name);
        db_connector.insert(self.data, (err, body) => {
            if (err) return callback(err);
            return callback(null, body);
        });
    }
}

module.exports = CloudantORM;
