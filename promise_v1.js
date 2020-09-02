function MyPromise(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError('MyPromise executor is not a function')
    }
    this.data = undefined
    this.deferreds = []
    this.state = 'pending'

    const resolve = function resolve(value) {
        try {
            this.data = value
            this.state = 'resolved'
            for (let i = 0; i < this.deferreds.length; i++) {
                try {
                    let result = this.deferreds[i].onResolved(this.data)
                    this.deferreds[i].resolve(result)
                } catch (err) {
                    reject(err)
                }

            }
        } catch (err) {
            reject(err)
        }
    }.bind(this)

    const reject = function reject(reason) {
        this.data = reason
        this.state = 'rejected'
        for (let i = 0; i < this.deferreds.length; i++) {
            this.deferreds[i].onRejected(this.data)
        }
    }.bind(this)

    //bind 方法重新绑定context
    fn(resolve, reject)
}


MyPromise.prototype.then = function then(onResolved, onRejected) {
    let that = this

    return new MyPromise((resolve, reject) => {
        if (that.state === 'resolved') {
            console.log('resolved');
            if (typeof onResolved === 'function') {
                const result = onResolved(that.data)
                if (result instanceof MyPromise) {
                    result.then(resolve, reject)
                } else {
                    resolve(result)
                }
            } else {
                resolve(that.data)
            }

            // resolve(that.resolvedResult)
        } else if (that.state === 'rejected') {
            console.log('rejected');

            // reject()
        } else if (that.state === 'pending') {
            console.log('pending');
            that.deferreds.push({
                onResolved,
                onRejected,
                resolve,
                reject
            })

        }
    })
}

MyPromise.prototype.resolve = function resolve(value) {
    return new MyPromise((resolve, reject) => {
        resolve(value)
    })
}
MyPromise.prototype.reject = function reject(value) {
    return new MyPromise((resolve, reject) => {
        reject(value)
    })
}

module.exports = MyPromise