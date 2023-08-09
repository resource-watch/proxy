const Router = require('koa-router');
const config = require('config');
const request = require('request');
const logger = require('logger');

const URLS = config.get('urls').split(',').map((pack) => pack.split('#')).reduce((prev, parts) => {
    // eslint-disable-next-line prefer-destructuring
    prev[parts[0]] = parts[1];
    return prev;
}, {});

logger.debug('URLS', URLS);

const router = new Router({
    prefix: '/proxy',
});

class ProxyRouter {

    static async proxy(ctx) {

        ctx.assert(URLS[ctx.params.alias], 400, 'Alias not found');

        logger.debug('query', `${URLS[ctx.params.alias]}${ctx.query.path}`, ctx.query);
        const qs = { ...ctx.query };
        delete qs.loggedUser;
        delete qs.path;
        const req = request({
            method: ctx.request.method,
            url: `${URLS[ctx.params.alias]}${ctx.query.path ? ctx.query.path : ''}`,
            qs
        });
        req.on('response', (response) => {
            ctx.response.status = response.statusCode;
            ctx.set(response.headers);
        });
        ctx.body = req;
    }

}

router.get('/:alias', ProxyRouter.proxy);

module.exports = router;
