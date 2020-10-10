export function isObjectOrFunction(x) {
    const type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
}

export function isFunction(x) {
    return typeof x === 'function';
}

// 占位函数，不执行操作
export function noop() {}