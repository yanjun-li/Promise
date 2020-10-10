import { asap } from './asap';
import { resolver } from './resolver'
export const STATE = {
    Pending: void 0,
    Fulfilled: 1,
    Rejected: 2,
}

export function subscribe(promise1, promise2, settledHandler) {
    let { subscribes } = promise1;

    subscribes[STATE.Fulfilled].push((result)=>callSettledHandler.call(null, promise2, settledHandler[STATE.Fulfilled], result))
    subscribes[STATE.Rejected].push((result)=>callSettledHandler.call(null, promise2, settledHandler[STATE.Rejected], result))
}

export function publish(promise) {
    let { subscribes, state, result } = promise;

    let handlers = subscribes[state];
    if (handlers.length > 0) {
        handlers.forEach(handler => {
            handler(result);
        });
    }

    subscribes = {
        1: [],
        2: []
    };
}

export function fulfill(value) {
    if (this.state !== STATE.Pending) return;

    this.state = STATE.Fulfilled;
    this.result = value;

    if (this.subscribes[this.state].length > 0) {
        asap(publish, this);
    }
}

export function reject(reason) {
    if (this.state !== STATE.Pending) return;

    this.state = STATE.Rejected;
    this.result = reason;

    if (this.subscribes[this.state].length > 0) {
        asap(publish, this)
    }
}

export function callSettledHandler(promise, handler, result) {
    try {
        let x = handler(result);
        resolver(promise, x);
    } catch (error) {
        reject.call(promise, error);
    }
}

export function callSettledHandlerAsync(promise, handler, result) {
    asap(() => {
        callSettledHandler(promise, handler, result);
    })
}

