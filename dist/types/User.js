"use strict";
exports.__esModule = true;
var nexus_1 = require("nexus");
exports.User = nexus_1.objectType({
    name: 'User',
    definition: function (t) {
        t.model.id();
        t.model.name();
        t.model.email();
        t.model.avatar();
        t.model.nickname();
        t.model.role();
        t.model.createdAt();
        t.model.updatedAt();
    }
});
