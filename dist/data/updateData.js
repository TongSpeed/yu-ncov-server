"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var client_1 = require("@prisma/client");
var Task = __importStar(require("fp-ts/lib/Task"));
var A = __importStar(require("fp-ts/lib/Array"));
var pipeable_1 = require("fp-ts/lib/pipeable");
var macoolka_object_1 = require("macoolka-object");
var dateFns = __importStar(require("date-fns"));
var macoolka_predicate_1 = require("macoolka-predicate");
var getTodayBegin = function (a) {
    var cloneValue = new Date(macoolka_predicate_1.isString(a) ? a : a.toISOString());
    var b = new Date(cloneValue.setHours(0, 0, 0, 0));
    return b;
};
var getTodayEnd = function (a) {
    var cloneValue = new Date(macoolka_predicate_1.isString(a) ? a : a.toISOString());
    var b = new Date(cloneValue.setHours(0, 0, 0, 0));
    return dateFns.addDays(b, 1);
};
var recordToDB = function (data, sourceUrl) {
    if (sourceUrl === void 0) { sourceUrl = 'https://ncov.dxy.cn/ncovh5/view/pneumonia'; }
    var photon = new client_1.PrismaClient();
    var upsertCountryTask = function (current) { return pipeable_1.pipe(function () { return photon.countries.upsert({
        where: { id: current.country },
        create: {
            id: current.country,
            title: current.country,
            continents: current.continents
        },
        update: {
            continents: current.continents
        }
    }); }); };
    var upsertProvinceTask = function (current) { return function () { return photon.provinces.upsert({
        where: { id: current.province },
        create: {
            id: current.province,
            title: current.province,
            country: {
                connect: { id: current.country }
            }
        },
        update: {}
    }); }; };
    var upsertCityTask = function (current) { return function () { return photon.cities.upsert({
        where: { id: current.city },
        create: {
            id: current.city,
            title: current.city,
            province: {
                connect: { id: current.province }
            }
        },
        update: {}
    }); }; };
    var toCountryDB = function (current) {
        var country = upsertCountryTask(current);
        var recordTask = pipeable_1.pipe(function () {
            return photon.countryRecords.findMany({
                where: {
                    recordAt: { gte: getTodayBegin(current.recordAt), lte: getTodayEnd(current.recordAt) },
                    country: { id: { equals: current.country } }
                }
            });
        }, Task.chain(function (value) {
            var id = value.length > 0 ? value[0].id : undefined;
            if (id) {
                var update = function () { return (value[0].recordAt < current.recordAt) ? photon.countryRecords.update({
                    where: { id: id },
                    data: __assign(__assign({}, macoolka_object_1.pick(current, ['suspectedCount', 'confirmedCount',
                        'curedCount', 'deadCount', 'seriousCount', 'continents',
                        'suspectedAddCount', 'confirmedAddCount', 'curedAddCount',
                        'deadAddCount', 'seriousAddCount'])), { recordAt: current.recordAt, country: { connect: { id: current.country } }, sourceUrl: sourceUrl, virus: { connect: { id: 'cnov' } } })
                }) : Promise.resolve(""); };
                return update;
            }
            else {
                var create = function () { return photon.countryRecords.create({
                    data: __assign(__assign({}, macoolka_object_1.pick(current, ['suspectedCount', 'confirmedCount',
                        'curedCount', 'deadCount', 'seriousCount', 'continents',
                        'suspectedAddCount', 'confirmedAddCount', 'curedAddCount',
                        'deadAddCount', 'seriousAddCount'])), { recordAt: current.recordAt, country: { connect: { id: current.country } }, sourceUrl: sourceUrl, virus: { connect: { id: 'cnov' } } })
                }); };
                return pipeable_1.pipe([country, create], A.array.sequence(Task.taskSeq));
            }
        }));
        return recordTask;
    };
    var toDB = function (a) {
        return pipeable_1.pipe(__spreadArrays(a.countries.map(toCountryDB), a.provinces.map(toProvinceDB), a.cities.map(toCityDB)), A.array.sequence(Task.taskSeq), Task.chain(function () { return function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, photon.disconnect()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); }; }));
    };
    var toCityDB = function (current) {
        var country = upsertCountryTask(current);
        var province = upsertProvinceTask(current);
        var city = upsertCityTask(current);
        var virusRecord = pipeable_1.pipe(function () {
            return photon.cityRecords.findMany({
                where: {
                    recordAt: { gte: getTodayBegin(current.recordAt), lte: getTodayEnd(current.recordAt) },
                    city: { id: { equals: current.city } },
                    province: { id: { equals: current.province } },
                    country: { id: { equals: current.country } }
                }
            });
        }, Task.chain(function (value) {
            var id = value.length > 0 ? value[0].id : undefined;
            if (id) {
                var update = function () { return value[0].recordAt <= current.recordAt ? photon.cityRecords.update({
                    where: { id: id },
                    data: __assign(__assign({}, macoolka_object_1.pick(current, ['suspectedCount', 'confirmedCount', 'curedCount', 'deadCount'])), { recordAt: current.recordAt, country: { connect: { id: current.country } }, province: {
                            connect: { id: current.province }
                        }, city: {
                            connect: { id: current.city }
                        }, sourceUrl: sourceUrl, virus: { connect: { id: 'cnov' } } })
                }) : Promise.resolve(void 0); };
                return update;
            }
            else {
                var create = function () { return photon.cityRecords.create({
                    data: __assign(__assign({}, macoolka_object_1.pick(current, ['suspectedCount', 'confirmedCount', 'curedCount', 'deadCount'])), { recordAt: current.recordAt, country: { connect: { id: current.country } }, province: {
                            connect: { id: current.province }
                        }, city: {
                            connect: { id: current.city }
                        }, sourceUrl: sourceUrl, virus: { connect: { id: 'cnov' } } })
                }); };
                return pipeable_1.pipe([country, province, city, create], A.array.sequence(Task.taskSeq));
            }
        }));
        return virusRecord;
    };
    var toProvinceDB = function (current) {
        var country = upsertCountryTask(current);
        var province = upsertProvinceTask(current);
        var virusRecord = pipeable_1.pipe(function () {
            return photon.provinceRecords.findMany({
                where: {
                    recordAt: { gte: getTodayBegin(current.recordAt), lte: getTodayEnd(current.recordAt) },
                    province: { id: { equals: current.province } },
                    country: { id: { equals: current.country } }
                }
            });
        }, Task.chain(function (value) {
            var id = value.length > 0 ? value[0].id : undefined;
            if (id) {
                var update = function () { return value[0].recordAt <= current.recordAt ? photon.provinceRecords.update({
                    where: { id: id },
                    data: __assign(__assign({}, macoolka_object_1.pick(current, ['suspectedCount', 'confirmedCount', 'curedCount', 'deadCount'])), { recordAt: current.recordAt, country: { connect: { id: current.country } }, province: {
                            connect: { id: current.province }
                        }, sourceUrl: sourceUrl, virus: { connect: { id: 'cnov' } } })
                }) : Promise.resolve(('void 0')); };
                return update;
            }
            else {
                return pipeable_1.pipe([country, province, function () { return photon.provinceRecords.create({
                        data: __assign(__assign({}, macoolka_object_1.pick(current, ['suspectedCount', 'confirmedCount', 'curedCount', 'deadCount'])), { recordAt: current.recordAt, country: { connect: { id: current.country } }, province: {
                                connect: { id: current.province }
                            }, sourceUrl: sourceUrl, virus: { connect: { id: 'cnov' } } })
                    }); }], A.array.sequence(Task.taskSeq));
            }
        }));
        return virusRecord;
    };
    return toDB(data);
};
exports["default"] = recordToDB;
