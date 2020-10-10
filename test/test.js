// import {Promise} from '../promise_v3'
// import Promise from 'es6-promise'
import { Promise } from '../src/promise'
import promisesAplusTests from 'promises-aplus-tests'

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

const { deferred, resolved, rejected } = adapter;

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it
var sentinel = { sentinel: "sentinel" }; // a sentinel fulfillment value to test for with strict equality
var other = { other: "other" }; // a value we don't want to be strict equal to
var sentinelArray = [sentinel]; // a sentinel fulfillment value to test when we need an array


// function xFactory() {
//     return {
//         then: function (resolvePromise) {
//             resolvePromise(yFactory());
//         }
//     };
// }
function xFactory() {
    return {
        a: 1
    };
}

function yFactory() {
    return null;
}

let d =  deferred();
var promise = d.promise;

// promise.then(function onBasePromiseFulfilled() {
//     return xFactory();
// });

// promise.then(() => {
//     return other
// })
// promise.then(() => {
//     throw new Error('err');
// })

// promise.then(() => {
//     console.log('ss');
//     return other
// })

promise.then(res => {
    console.log('res:', res);
}, rej => {
    console.log('rej:', rej);
})

d.resolve(sentinel);
// function test(promise) {
    
// }

// test(promise)

var p1 = Promise.resolve({ 
    then: function(onFulfill, onReject) { onFulfill("fulfilled!"); }
  });
  console.log(p1 instanceof Promise) // true, 这是一个Promise对象

  p1.then(function(v) {
      console.log(v); // 输出"fulfilled!"
    }, function(e) {
      // 不会被调用
  });

// let p1 = new Promise((res,rej)=>{
//     throw Error('e')
// })
console.log(p1);

let testAPlus;
testAPlus = true
if (testAPlus) {
    promisesAplusTests(adapter, {
        // reporter: "landing"
    }, function (err) {
        // All done; output is in the console. Or check `err` for number of failures.
        // console.error(err)
    });
}