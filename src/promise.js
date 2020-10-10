import { fulfill, reject } from './core'
import {resolver} from './resolver'
import { then } from './then'
import { isFunction, noop } from './utils'

class Promise {
    constructor(executor) {
        // 初始化设置为 undefined
        this.result = this.state = void 0;
        this.subscribes = {
            1: [],
            2: []
        };
        if (!isFunction) {
            throw new TypeError(`Promise executor ${executor} is not a function`)
        }
        if (!new.target) {
            throw new TypeError(`Constructor ${this.name} requires 'new'`)
        }
        try {
            executor(fulfill.bind(this), reject.bind(this));
        } catch (error) {
            reject.call(this, error)
        }
    }

    then = then

    static resolve(value) {
        if (value instanceof Promise) {
            // if (value.constructor instanceof this.constructor) {
            return value
        }
        
        // const promise = new Promise((fulfill) => fulfill(value))

        const promise = new Promise(noop);
        resolver(promise, value);

        return promise
    }

    static reject(reason) {
        const promise = new Promise((fulfill, reject) => reject(reason))
        return promise
    }
}

export {
    Promise
} 
