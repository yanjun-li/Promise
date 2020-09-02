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
            resolve.call(promise, value)
        }, (err) => {
            reject.call(promise, err)
        })
    }
    if (x && typeof (x === 'object' && typeof x === 'function')) {
        try {
            let then = x.then
            if (typeof then === 'function') {
                function resolvePromise(y) {
                    resolver(promise, y)
                }
                function rejectPromise(r) {
                    reject.call(promise, r)
                }
                try {
                    then(resolvePromise, rejectPromise)
                } catch (error) {
                    throw error
                }
            } else {
                resolve.call(promise, x)
            }
        } catch (err) {
            throw error
        }
    } else {
        resolve.call(promise, x)
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
function resolve(value) {
    if (this.state === STATE.Pending) {
        this.value = value
        this.state = STATE.Fulfilled
        this.queue.forEach(({ promise, onFullfilled }) => {
            if (isFunction(onFullfilled)) {
                try {
                    setTimeout(() => {
                        let x = onFullfilled(this.value)
                        resolver(promise, x)
                    }, 0)
                    // let x = onFullfilled(this.value)
                    // resolver(promise, x)
                } catch (error) {
                    reject.call(promise, error)
                }
            } else {
                resolve.call(promise, this.value)
            }
        })
    }
}

function reject(reason) {
    if (this.state === STATE.Pending) {
        this.reason = reason
        this.state = STATE.Rejected
        this.queue.forEach((promise, onRejected) => {
            if (isFunction(onRejected)) {
                try {
                    setTimeout(() => {
                        let x = onRejected(this.reason)
                        resolver(promise, x)
                    }, 0)
                    // let x = onRejected(this.reason)
                    // resolver(promise, x)
                } catch (error) {
                    reject.call(promise, error)
                }
            } else {
                resolve.call(promise, this.value)
            }
        })
    }
}

Promise.prototype.then = function (onFullfilled, onRejected) {
    let promise = new Promise(() => { })

    let deferred = {
        promise,
        onFullfilled,
        onRejected
    }

    this.queue.push(deferred)
    
    return promise
}

Promise.resolve = function (value) {
    return new Promise((resolve) => resolve(value))
}

Promise.reject = function (reason) {
    return new Promise((resolve, reject) => reject(reason))
}
module.exports = Promise