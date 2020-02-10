"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var nexus_prisma_1 = require("nexus-prisma");
var nexus_1 = require("nexus");
var types = __importStar(require("./types"));
exports.schema = nexus_1.makeSchema({
    types: types,
    plugins: [nexus_prisma_1.nexusPrismaPlugin()],
    outputs: {
        schema: __dirname + '/generated/schema.graphql',
        typegen: __dirname + '/generated/nexus.ts'
    },
    typegenAutoConfig: {
        sources: [
            {
                source: '@prisma/client',
                alias: 'client'
            },
            {
                source: require.resolve('./context'),
                alias: 'Context'
            },
        ],
        contextType: 'Context.Context'
    }
});
