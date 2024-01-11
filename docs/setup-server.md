The easiest way to get up and running is using docker

First let’s deploy the container

```bash
docker run -p 4500:4500 -n mini-loader ghcr.io/morten-olsen/mini-loader:main
```

That’s it, your server should be running

```bash
curl http://localhost:4500/health
```

Next we need to authorize. Since we have not setup authorization, we need to use our container to issue a token.

```bash
docker exec mini-loader mini-loader create-token
```

Which will output a token for us to use

Now we need to authorize our CLI client before we can start to interact with our server.

```bash
mini-loader auth login https://localhost:4500
```

Verify that the CLI is working by fetching the loads

```bash
mini-loader loads ls
```

[Next: interacting with the server](./interacting-with-server.md]
