"use strict";
exports.__esModule = true;
var nexus_1 = require("nexus");
exports.VirusInfo = nexus_1.objectType({
    name: 'VirusInfo',
    definition: function (t) {
        t.model.id();
        t.model.title();
        t.model.description();
    }
});
exports.CountryRecord = nexus_1.objectType({
    name: 'CountryRecord',
    definition: function (t) {
        t.model.id();
        t.model.country();
        t.model.recordAt();
        t.model.virus();
        t.model.sourceUrl();
        t.model.seriousCount();
        t.model.suspectedCount();
        t.model.confirmedCount();
        t.model.deadCount();
        t.model.curedCount();
        t.model.continents();
        t.model.seriousAddCount();
        t.model.suspectedAddCount();
        t.model.confirmedAddCount();
        t.model.deadAddCount();
        t.model.curedAddCount();
        t.model.createdAt();
        t.model.updatedAt();
    }
});
exports.ProvinceRecord = nexus_1.objectType({
    name: 'ProvinceRecord',
    definition: function (t) {
        t.model.id();
        t.model.country();
        t.model.province();
        t.model.recordAt();
        t.model.virus();
        t.model.sourceUrl();
        t.model.suspectedCount();
        t.model.confirmedCount();
        t.model.deadCount();
        t.model.curedCount();
        t.model.createdAt();
        t.model.updatedAt();
    }
});
exports.CityRecord = nexus_1.objectType({
    name: 'CityRecord',
    definition: function (t) {
        t.model.id();
        t.model.country();
        t.model.province();
        t.model.city();
        t.model.recordAt();
        t.model.virus();
        t.model.sourceUrl();
        t.model.suspectedCount();
        t.model.confirmedCount();
        t.model.deadCount();
        t.model.curedCount();
        t.model.createdAt();
        t.model.updatedAt();
    }
});
