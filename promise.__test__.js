var promisesAplusTests = require("promises-aplus-tests");


const MyPromise = require('./mypromise')
let Promise = require('./promise_v3')

// Promise = MyPromise

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


// promisesAplusTests(adapter, { reporter: "landing" }, function (err) {
promisesAplusTests(adapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
    // console.error(err)
});

const {resolved, rejected} = adapter;


var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it
var sentinel = { sentinel: "sentinel" }; // a sentinel fulfillment value to test for with strict equality
var other = { other: "other" }; // a value we don't want to be strict equal to
var sentinelArray = [sentinel]; // a sentinel fulfillment value to test when we need an array


function xFactory() {
    return {
        then: function (resolvePromise) {
            resolvePromise(yFactory());
        }
    };
}

function outerThenableFactory(value) {
    // return {
    //     then: function (onFulfilled) {
    //         onFulfilled(value);
    //     }
    // };
    return resolved(value);
}
function innerThenableFactory(value) {
    return {
        then: function (onFulfilled) {
            onFulfilled(value);
        }
    };
}

function yFactory() {
    return outerThenableFactory(innerThenableFactory(sentinel));
}

var promise = resolved(dummy).then(function onBasePromiseFulfilled() {
    return xFactory();
});

function test(promise) {
    promise.then(res=>{
        console.log('res:',res);
    }, rej=>{
        console.log('rej:',rej);
    })
}

test(promise)

p = yFactory()
p.then(ref=>{
    console.log(ref);
})
console.log(p);

// mdn promise
// var p1 = Promise.resolve({ 
//     then: function(onFulfill, onReject) { onFulfill("fulfilled!"); }
//   });
//   console.log(p1 instanceof Promise) // true, 这是一个Promise对象
  
//   p1.then(function(v) {
//       console.log(v); // 输出"fulfilled!"
//     }, function(e) {
//       // 不会被调用
//   });