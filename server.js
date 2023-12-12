/* eslint-disable no-undef */
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const path = require('path');

const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router-dom/server');
const App = require('./src/App');

const ABORT_DELAY = 10000;

const app = new Koa();
app.use(serve(path.join(__dirname, '/public')));

if (process.env.NODE_ENV === 'development') {
  app.use(serve(path.join(__dirname, '/.parcel')));
}

const router = new Router();

async function render(ctx) {
  let didError = false;

  /**
   * NOTE: use promise to force koa waiting for streaming.
   */
  return new Promise((_resolve, reject) => {
    const stream = ReactDOMServer.renderToPipeableStream(
      <StaticRouter location={ctx.url}>
        <App />
      </StaticRouter>,
      {
        bootstrapScripts: ['/index.js'],
        onShellReady() {
          ctx.respond = false;
          ctx.res.statusCode = didError ? 500 : 200;
          ctx.response.set('content-type', 'text/html');
          stream.pipe(ctx.res);
          ctx.res.end();
        },
        onError() {
          didError = true;
          reject();
        }
      }
    );
    setTimeout(() => {
      stream.abort();
      reject();
    }, ABORT_DELAY);
  });
}

router.get('(.*)', async (ctx) => {
  await render(ctx);
});

app.use(router.routes());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Koa server is running at http://localhost:${port}`);
});
