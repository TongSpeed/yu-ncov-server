"use strict";
exports.__esModule = true;
var nexus_1 = require("nexus");
exports.Country = nexus_1.objectType({
    name: 'Country',
    definition: function (t) {
        t.model.id();
        t.model.title();
        t.model.provinces();
    }
});
exports.Province = nexus_1.objectType({
    name: 'Province',
    definition: function (t) {
        t.model.id();
        t.model.title();
        t.model.country();
        t.model.cities();
    }
});
exports.City = nexus_1.objectType({
    name: 'City',
    definition: function (t) {
        t.model.id();
        t.model.title();
        t.model.province();
        t.model.areas();
    }
});
exports.Area = nexus_1.objectType({
    name: 'Area',
    definition: function (t) {
        t.model.id();
        t.model.title();
        t.model.city();
    }
});
