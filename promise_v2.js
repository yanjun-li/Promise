
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function resolveResolution(promise, x, resolve, reject) {
    try {
        if (promise === x) {
            throw new TypeError('Can not resolve promise with itself')
        }
        if (x && (typeof x === 'object' || typeof x === 'function')) {
            let then = x.then
            if (x instanceof Promise) {

            } else if (then === 'function') {

            }
        }
    } catch (err) {
        reject(err)
    }
    resolve(x)
}
function Promise(executor) {
    this.state = PENDING
    this.value = undefined
    this.reason = undefined
    this.callbacks = []
    const resolve = function resolve(value) {
        if (this.state === PENDING) {
            this.state = RESOLVED
            this.value = value
            if (this.callbacks.length > 0) {
                for (callback in this.callbacks) {
                    let result = callback.onResolved(value)
                    callback.resolve(result)
                }
            }
        }
    }.bind(this)

    const reject = function reject(reason) {
        if (this.state = PENDING) {
            this.state = REJECTED
            this.reason = reason
        }
    }.bind(this)

    executor(resolve, reject)
}

Promise.prototype.then = function then(onResolved, onRejected) {
    let self = this
    return new Promise((resolve, reject) => {
        if (self.state === PENDING) {
            self.callbacks.push({
                onResolved,
                onRejected,
                resolve,
                reject
            })
        }
        if (self.state === RESOLVED) {
            let result = onResolved(self.value)
            resolve(result)
        }
        if (self.state === REJECTED) {
            onRejected(self.reason)
            reject()
        }
    })
}