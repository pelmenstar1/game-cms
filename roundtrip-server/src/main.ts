import cors from '@fastify/cors';
import fastify from 'fastify';
import qs from 'qs';

const PORT = 3333;

const app = fastify();

app.register(cors, {
  origin: '*',
});

app.post('/', (req) => {
  return {
    url: `http://localhost:${PORT}/page?${qs.stringify(req.body)}`,
  };
});

app.get('/page', (req, res) => {
  const { search } = new URL(req.url, 'http://localhost:3333');
  const body = qs.parse(search.slice(1));

  res.type('text/html').send(`
<html>
  <body>
    <pre>${JSON.stringify(body, null, 2)}</body>
  </body>
</html>`);
});

const result = await app.listen({ port: PORT });

// eslint-disable-next-line no-console
console.log('Listening', result);
