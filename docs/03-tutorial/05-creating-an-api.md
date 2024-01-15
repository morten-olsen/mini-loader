## Creating an API Inside Your Workload

Workloads in mini loader can set up simple HTTP servers by connecting to a socket file, a feature supported by many JavaScript server libraries.

### Binding Your Workload to an HTTP Endpoint

To expose your workload as an HTTP server, specify the path parameter using the `getPath()` method provided by the `@morten-olsen/mini-loader` package. This method dynamically assigns a path for your API.

### Important Note

Please be aware that the gateway provided by mini loader isn't fully featured. As such, certain functionalities like streaming and WebSockets may not be supported.

### Example: Setting Up a Server with Fastify

Here's how you can create a simple API server using Fastify in TypeScript:

```typescript
import { http } from '@morten-olsen/mini-loader';
import fastify from 'fastify';

const server = fastify();

// Handling all requests and returning the requested URL
server.all('*', async (req) => {
  return req.url;
});

// Listening on the path provided by mini loader
server.listen({
  path: http.getPath(),
});
```

With this setup, your server will respond to all incoming requests by returning the requested URL.

### Deploying Your Workload

Now, you can push and run your workload just like any other script:

```bash
mini-loader loads push -r my-script.ts
```

### Accessing Your Server

After pushing your workload, mini loader will display the run ID. You can use this ID to access your server. For example, to make a request to your server, you can use `curl`:

```bash
curl http://localhost:4500/gateway/{your-run-id}
```

Replace `{your-run-id}` with the actual run ID provided by mini loader.
