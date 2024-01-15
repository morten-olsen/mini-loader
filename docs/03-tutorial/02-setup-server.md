Certainly! Here's a revised version of your documentation page to make it

## Quick Start with mini loader using Docker

This guide will help you quickly set up and run a mini loader server using Docker. Follow these simple steps to deploy your server and start interacting with it using the [mini-loader CLI](./01-first-workload.md).

### Step 1: Deploy the mini loader Container

To begin, let's deploy the mini loader container. Run the following command in your terminal:

```bash
docker run -p 4500:4500 -n mini-loader ghcr.io/morten-olsen/mini-loader:latest
```

This command downloads the latest mini loader image and runs it, exposing port 4500.

### Step 2: Verify Server Health

Once the container is running, you can check the server's health:

```bash
curl http://localhost:4500/health
```

This command should return a response indicating that the server is running smoothly.

### Step 3: Authorize Using a Token

Initially, your server won't have any authorization setup. You can issue a token directly from the container to use for authorization:

```bash
docker exec mini-loader mini-loader create-token
```

This command will output a token. Keep this token handy as you'll need it for the next step.

### Step 4: Authorize the CLI Client

Now, authorize your CLI client to interact with the server:

```bash
mini-loader auth login https://localhost:4500
```

Enter the token when prompted.

### Step 5: Verify CLI Connection

Finally, verify that the CLI is properly configured to interact with your server:

```bash
mini-loader loads ls
```

This command lists all the loads currently on your server, confirming that the CLI is communicating successfully with the server.

### Ready to Go!

You've successfully deployed and configured your mini loader server using Docker! You're now ready to start interacting with the server.

[Next: Interacting with the Server](./03-interacting-with-server.md)
