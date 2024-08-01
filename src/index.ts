import { WorkerEntrypoint } from 'cloudflare:workers';
import { Router } from 'itty-router';
import { getRealm } from './utils';

const router = Router();

router.get('/api/realm/:realm', async (req, env, ctx) => {
    const realm = req.params.realm;
    const query = req.query;
    return new Response(await getRealm(env, ctx, realm, query), { headers: { 'Content-Type': 'application/json' } });
});

export default class GatewayWorker extends WorkerEntrypoint<Env> {
    async fetch(req: Request) {
        const url = new URL(req.url);
        //const realm = url.pathname.split('/').pop();

        /*if (realm) {
            return new Response(await getRealm(this.env, this.ctx, realm, url.search), { headers: { 'Content-Type': 'application/json' } });
        }*/

        if (url.pathname.startsWith('/api')) {
            return await router.handle(req, this.env, this.ctx);
        }

        return new Response('Hello world!', { headers: { 'Content-Type': 'text/plain' } });
    }

    async realm(realm: string, search: string) {
        return await getRealm(this.env, this.ctx, realm, search);
    }
}
