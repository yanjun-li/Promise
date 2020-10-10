import { noop, isFunction } from './utils'
import { STATE, subscribe, callSettledHandlerAsync } from './core'

export function then(onFulfilled, onRejected) {
    const { state, result } = this;
    let promise = new this.constructor(noop);

    // 当父函数中使用回调函数作为参数时，回调函数可以使用父函数内部的值作为参数，对父函数内部的值进行操作，在使用时按照自己想法来定义即可。

    // 对特殊情况进行转换，将特殊情况转换为一般情况，方便后续逻辑处理。
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : (value) => value;
    onRejected = isFunction(onRejected) ? onRejected : (reason) => { throw reason };

    let settledHandler = {
        [STATE.Fulfilled]: onFulfilled,
        [STATE.Rejected]: onRejected
    }
    if (state) {
        callSettledHandlerAsync(promise, settledHandler[state], result);
    } else {
        subscribe(this, promise, settledHandler);
    }
    return promise
}