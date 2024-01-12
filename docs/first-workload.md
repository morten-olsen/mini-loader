## Getting Started with mini loader CLI

Welcome to the mini loader CLI! This guide will walk you through the installation of the CLI, creating a simple script, and executing it locally to ensure everything works smoothly.

### Step 1: Install the CLI

The mini loader CLI is your gateway to interacting with a mini-loader server and running workloads locally for validation. Install it globally using npm with the following command:

```bash
npm install -g @morten-olsen/mini-loader-cli
```

### Step 2: Create Your First Script

Now, let's write a basic script that outputs a single artifact named “hello”. Create a new file with the following JavaScript code:

```javascript
import { artifacts } from '@morten-olsen/mini-loader';

const run = async () => {
  artifacts.create('hello', 'world');
};

run();
```

Save this file as `script.js`.

#### A Note on Dependencies

In this script, we're using the `@morten-olsen/mini-loader` package, which might not be installed in your local environment. No worries though, as mini loader can automatically download necessary packages when preparing the script. Alternatively, for a more structured approach (especially if you're using TypeScript), you can initialize a Node.js project and install the dependencies for complete access to typings.

### Step 3: Run the Script Locally

To validate that your script is functioning correctly, execute it locally using the following command:

```bash
mini-loader local run script.js -ai
```

The `-ai` flag instructs the CLI to automatically download any referenced packages when bundling the script.

After running the command, you should see an output confirming that a new artifact named “hello” was created successfully.

### What's Next?

Congratulations on setting up and running your first script with mini loader! You're now ready to take the next step.

[Next: Setting Up the Server](./setup-server.md)
