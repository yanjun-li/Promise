const MyPromise = require('./promise_v3')

function doSomething() {
    return new MyPromise((resolve, reject) => {
        setTimeout(() => {
            let value = 42;
            resolve(value)
        }, 10)
    })
}

// p1 = MyPromise.reject('s');
// p1.then((v)=>{
//     console.log(v)
// }, (r)=>{
//     console.error(r)
// })



// p2 = doSomething()
// p2
// .then(value => {
//     console.log(value);
//     return 36
// }, err => {
//     console.error(err)
// })
// .then(value=>{
//     console.log(value)
// })

p3 = MyPromise.resolve('44')
p3.then((v)=>{
    console.log(v)
})
// p
// .then(value => {
//     console.log(1);
// }, err => {
//     console.error(err)
// })
// .then(value => {
//     console.log(value);
// }, err => {
//     console.error(err);
// })



// var p2 = new Promise(function (resolve, reject) {
//     resolve(1);
// });

// p2.then(function (value) {
//     return new Promise((f, r) => {
//         setTimeout(() => {
//             console.log('a', value);
//             f(value + 1)
//         }, 2000)
//     })
// }).then(function (value) {
//     setTimeout(() => {
//         console.log(value + ' - A synchronous value works');
//     }, 2000)
// });

// p2.then(function (value) {
//     setTimeout(() => {
//         console.log('b', value);
//     },1000)
// });

// p2.then(function (value) {
//     setTimeout(() => {
//         console.log('c', value);
//     },500)
// });
