const { Stats } = require("fs");

const STATE = {
    Pending: 0,
    Rejected: -1,
    Fulfilled: 1,
}
function isFunction(fun) {
    return fun && typeof fun === 'function'
}

function resolver(promise, x) {
    if (promise === x) {
        throw TypeError('promise === x');
    }
    if (x instanceof Promise) {
        x.then((value) => {
            // 如果value 是 thenable 对象，不能直接使用resolve
            resolver(promise, value)
            // resolve.call(promise, value)
        }, (err) => {
            reject.call(promise, err)
        })
    }
    if (x && typeof (x === 'object' && typeof x === 'function')) {
        try {
            let then = x.then
            if (typeof then === 'function') {
                let called = false;
                function resolvePromise(y) {
                    if(called) return;
                    called = true;
                    resolver(promise, y)
                }
                function rejectPromise(r) {
                    if(called) return;
                    called = true;
                    reject.call(promise, r)
                }
                try {
                    then.call(x, resolvePromise, rejectPromise)
                } catch (error) {
                    if(called) return;
                    // throw error
                    reject.call(promise, error)
                }
            } else {
                resolve.call(promise, x)
            }
        } catch (error) {
            reject.call(promise, error)
            // throw error
        }
    } else {
        resolve.call(promise, x)
    }
}

function resolve(value) {
    if (this.state === STATE.Pending) {
        this.state = STATE.Fulfilled
        this.value = value
        setTimeout(() => {
            this.queue.forEach(({ promise, onFullfilled }) => {
                if (isFunction(onFullfilled)) {
                    try {
                        // setTimeout(()=>{
                        //     let x = onFullfilled(this.value)
                        //     resolver(promise, x)
                        // }, 0)
                        let x = onFullfilled(this.value)
                        resolver(promise, x)
                    } catch (error) {
                        reject.call(promise, error)
                    }
                } else {
                    resolve.call(promise, this.value)
                }
            })
        }, 0)
    }
}

function reject(reason) {
    if (this.state === STATE.Pending) {
        this.reason = reason
        this.state = STATE.Rejected
        setTimeout(() => {
            this.queue.forEach(({ promise, onRejected }) => {
                if (isFunction(onRejected)) {
                    try {
                        // setTimeout(() => {
                        //     let x = onRejected(this.reason)
                        //     resolver(promise, x)
                        // }, 0)
                        let x = onRejected(this.reason)
                        resolver(promise, x)
                    } catch (error) {
                        reject.call(promise, error)
                    }
                } else {
                    reject.call(promise, this.reason)
                }
            })
        }, 0)
    }
}

// TODO: 添加then 多次调用
function Promise(callback) {
    this.state = STATE.Pending
    this.value = undefined
    this.reason = undefined
    this.queue = []
    // 检测callback 是否为函数
    try {
        // 作为resolve 作为参数传入，内部的this 指向为 undefined
        callback(resolve.bind(this), reject.bind(this))
    } catch (err) {
        throw TypeError(`Promise resolver ${callback} is not a function`)
    }
}

Promise.prototype.then = function (onFullfilled, onRejected) {
    let promise = new Promise(() => { })

    let deferred = {
        promise,
        onFullfilled,
        onRejected
    }
    if (this.state === STATE.Pending) {
        this.queue.push(deferred)
    } else if (this.state === STATE.Fulfilled) {
        setTimeout(() => {
            if (isFunction(onFullfilled)) {
                try {
                    // setTimeout(()=>{
                    //     let x = onFullfilled(this.value)
                    //     resolver(promise, x)
                    // }, 0)
                    let x = onFullfilled(this.value)
                    resolver(promise, x)
                } catch (error) {
                    reject.call(promise, error)
                }
            } else {
                resolve.call(promise, this.value)
            }
        })
    } else if (this.state === STATE.Rejected) {
        setTimeout(() => {
            if (isFunction(onRejected)) {
                try {
                    // setTimeout(() => {
                    //     let x = onRejected(this.reason)
                    //     resolver(promise, x)
                    // }, 0)
                    let x = onRejected(this.reason)
                    resolver(promise, x)
                } catch (error) {
                    reject.call(promise, error)
                }
            } else {
                reject.call(promise, this.reason)
            }
        }, 0);
    }
    return promise
}

Promise.resolve = function (value) {
    if(value instanceof Promise) {
        return value
    }
    const promise = new Promise((resolve) => resolve(value))
    // resolver(promise, value);
    return promise
}

Promise.reject = function (reason) {
    const promise = new Promise((resolve, reject) => reject(reason))
    // resolver(promise, value);
    return promise
}
module.exports = Promise