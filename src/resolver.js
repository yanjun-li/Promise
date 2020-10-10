import {fulfill, reject} from './core'
import { isFunction, isObjectOrFunction } from './utils'

// promise A+ 中  [[Resolve]](promise, x) 的实现
export function resolver(promise, x) {
    if (promise === x) {
        let err = TypeError("promise can't resolve by itself");
        reject.call(promise, err)

    } 
    // else if (x instanceof Promise) {
    //     x.then((value) => {
    //         // 如果value 是 thenable 对象，不能直接使用resolve
    //         resolver(promise, value)
    //         // fulfill.call(promise, value)
    //     }, (err) => {
    //         reject.call(promise, err)
    //     })
    // } 
    else if (isObjectOrFunction(x)) {
        let then
        try {
            then = x.then;
        } catch (error) {
            reject.call(promise, error)
            return
        }
        handlerThenable(promise, x, then);
    } else {
        fulfill.call(promise, x)
    }
}

function handlerThenable(promise, x, then) {
    if (promise.constructor === x.constructor) {
        // 2.3.2 x 为 promise 
        x.then((value) => {
            // 如果value 是 thenable 对象，不能直接使用resolve
            resolver(promise, value)
            // fulfill.call(promise, value)
        }, (err) => {
            reject.call(promise, err)
        })
    } else {
        // 2.3.3 x 为对象或函数
        if (isFunction(then)) {
            let called = false;
            function resolvePromise(y) {
                if (called) return;
                called = true;
                resolver(promise, y)
            }
            function rejectPromise(r) {
                if (called) return;
                called = true;
                reject.call(promise, r)
            }
            try {
                then.call(x, resolvePromise, rejectPromise)
            } catch (error) {
                if (called) return;
                reject.call(promise, error)
            }
        } else {
            fulfill.call(promise, x)
        }
    }
}