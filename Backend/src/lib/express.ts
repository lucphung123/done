const Layer = require('express/lib/router/layer');

function isAsyncFunction(value) {
    return value[Symbol.toStringTag] === 'AsyncFunction';
}

Layer.prototype.handle_request = async function handle(req, res, next) {
    const fn = this.handle;
    switch (fn.length) {
        case 0:
            next();
            break;
        case 1:
            next();
            break;
        case 2:
            // (req, res) => {}
            try {
                if (isAsyncFunction(fn)) {
                    await fn(req, res);
                } else {
                    fn(req, res);
                }
                if (!res.headersSent) {
                    next();
                }
            } catch (err) {
                next(err);
            }
            break;
        case 3:
            // (req, res, next) => {}
            fn(req, res, next);
            break;
        default:
            next();
            break;
    }
};