"use strict";
exports.__esModule = true;
var nexus_1 = require("nexus");
exports.AuthPayload = nexus_1.objectType({
    name: 'AuthPayload',
    definition: function (t) {
        t.string('token');
        t.field('user', { type: 'User' });
    }
});
