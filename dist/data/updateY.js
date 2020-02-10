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
var A = __importStar(require("fp-ts/lib/Array"));
var Task = __importStar(require("fp-ts/lib/Task"));
var pipeable_1 = require("fp-ts/lib/pipeable");
var Ord_1 = require("fp-ts/lib/Ord");
var ordRecordAt = Ord_1.contramap(function (_a) {
    var recordAt = _a.recordAt;
    return recordAt;
})(Ord_1.ordDate);
exports.add = function (keys) { return function (_a) {
    var a = _a[0], b = _a[1];
    return pipeable_1.pipe(keys, A.reduce({}, function (result, key) {
        var _a;
        return (__assign(__assign({}, result), (_a = {}, _a[key + 'Y'] = Number(b[key]), _a)));
    }));
}; };
exports.toVirusRecords = function (as1) {
    if (as1.length >= 2) {
        return pipeable_1.pipe(as1, A.sort(ordRecordAt), A.reverse, function (as) { return A.zip(as, __spreadArrays(as.slice(1), [{ deadCount: 0, suspectedCount: 0, confirmedCount: 0, curedCount: 0, recordAt: new Date() }])); }, A.map(function (_a) {
            var a = _a[0], b = _a[1];
            return (__assign(__assign({}, a), exports.add(['deadCount', 'suspectedCount', 'confirmedCount', 'curedCount'])([a, b])));
        }));
    }
    else if (as1.length === 1) {
        return exports.add(['deadCount', 'suspectedCount', 'confirmedCount', 'curedCount'])([as1[0], { deadCount: 0, suspectedCount: 0, confirmedCount: 0, curedCount: 0 }]);
    }
    else {
        return [];
    }
};
var photon = new client_1.PrismaClient();
var recordToDB = function () {
    return pipeable_1.pipe(function () { return photon.countries.findMany(); }, Task.map(function (countries) { return pipeable_1.pipe(countries, A.map(function (a) {
        console.log(a);
    })); }));
    /* return pipe(
         ()=> photon.countries.findMany({include:{countryRecords:true}}),
         Task.map(countries=> pipe(
             countries,
             A.map(a=>
                 pipe(
                     a.countryRecords,
                     toVirusRecords,
                     a=>{
                         console.log(a)
                     }
     
                     
                 )
                 
             )
         ))
     ) */
    /*  if(a){
         const countries=await photon.countries.findMany({include:{countryRecords:true}})
         pipe(
             countries,
             A.map(a=>
                 pipe(
                     a.countryRecords,
                     toVirusRecords,
                     a=>{
                         console.log(a)
                     }
     
                     
                 )
                 
             )
         )
     }else{
         photon.countries()
     } */
};
recordToDB()().then(function () {
    console.log('ok');
})["finally"](function () {
    photon.disconnect();
});
