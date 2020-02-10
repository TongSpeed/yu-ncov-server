"use strict";
exports.__esModule = true;
var nexus_1 = require("nexus");
var utils_1 = require("../utils");
exports.Query = nexus_1.queryType({
    definition: function (t) {
        t.crud.countryRecords({ filtering: true, ordering: true });
        t.crud.provinceRecords({ filtering: true, ordering: true });
        t.crud.cityRecords({ filtering: true, ordering: true });
        t.crud.countries();
        t.crud.provinces({ filtering: true, ordering: true });
        t.crud.cities({ filtering: true, ordering: true });
        t.crud.areas({ filtering: true, ordering: true });
        t.crud.virusInfo();
        t.crud.country();
        t.crud.provinces({ filtering: true, ordering: true });
        t.crud.city();
        t.field('me', {
            type: 'User',
            nullable: true,
            resolve: function (parent, args, ctx) {
                var userId = utils_1.getUserId(ctx);
                return ctx.prisma.users.findOne({
                    where: {
                        id: userId
                    }
                });
            }
        });
    }
});
