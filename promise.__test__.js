var promisesAplusTests = require("promises-aplus-tests");


const Promise = require('./promise_v3')

var adapter = (function () {
    var res, rej;
    return {
        deferred: function () {
            return {
                promise: new Promise(function (resolve, reject) {
                    res = resolve;
                    rej = reject;
                }),
                resolve: res,
                reject: rej,
            }
        },
        resolved: Promise.resolve,
        rejected: Promise.reject
    }
})();

promisesAplusTests(adapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
    // console.error(err)
});
