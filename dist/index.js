"use strict";
exports.__esModule = true;
var apollo_server_micro_1 = require("apollo-server-micro");
var schema_1 = require("./schema");
var context_1 = require("./context");
var apolloServer = new apollo_server_micro_1.ApolloServer({ schema: schema_1.schema, context: context_1.createContext });
exports["default"] = apolloServer.createHandler({ path: '/api' });
