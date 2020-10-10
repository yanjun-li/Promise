const queue = [];
let len = 0;

function asap(callback, args) {
    queue[len] = callback;
    queue[len + 1] = args;

    len += 2;

    // 在len > 2 时加入的callback 也会在此次加入队列中
    if (len === 2) {
        scheduleFlush();
    }
}

function flush() {
    for (let i = 0; i < len; i += 2) {
        let callback = queue[i];
        let args = queue[i + 1];

        callback(args);

        queue[i] = undefined;
        queue[i + 1] = undefined;

    }
    len = 0;
}

const isNode = typeof self === 'undefined' && typeof process !== undefined && Object.prototype.toString.call(process) === '[object process]';

const browserWindow = (typeof window !== 'undefined') ? window : undefined;
const browserGlobal = browserWindow || {};

const BrowserMutationObserver = browserGlobal.MutationObserver;

const isWorker = typeof MessageChannel !== undefined;

let scheduleFlush;

if (isNode) {
    scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
} else if (isWorker) {
    scheduleFlush = useMessageChannel();
} else {
    scheduleFlush = useSetTimeout();
}

function useNextTick() {
    return () => process.nextTick(flush)
}

function useMutationObserver() {
    let iteration = 0;
    const observer = new BrowserMutationObserver(flush);
    let node = document.createTextNode('')
    observer.observe(node, {
        characterData: true
    });
    return () => {
        node.data = (iteration = ++iteration % 2);
    }
}

function useMessageChannel() {
    const channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return () => channel.port2.postMessage(0);
}

function useSetTimeout() {
    return () => setTimeout(flush, 0)
}

export {
    asap
}