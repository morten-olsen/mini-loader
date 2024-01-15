## Managing Secrets

### Introduction

In many workflows, accessing sensitive data such as API tokens or credentials is essential. To handle this securely, you can use secrets management. This tutorial demonstrates how to manage secrets using the CLI and implement them in a simple Node.js workload.

### Creating Secrets with the CLI

To create a new secret, use the `mini-loader` CLI as follows:

```bash
mini-loader secrets set <id>
```

For example, to store a GitHub personal access token, you would use:

```bash
mini-loader secrets set githubtoken
```

Upon execution, you'll be prompted to enter your access token.

### Implementing Secrets in Your Workload

Next, let's create a Node.js script (`github.js`) that uses this token to fetch your GitHub username and saves it as an artifact.

1. **Create `github.js` File:**

   ```javascript
   import { secrets, artifacts } from '@morten-olsen/mini-loader';
   import { Octokit } from '@octokit/rest';

   // Retrieve the secret
   const accessToken = secrets.get('githubtoken');

   // Main async function to fetch and save GitHub username
   async function run() {
     const octokit = new Octokit({ auth: accessToken });
     const user = await octokit.users.getAuthenticated();
     await artifacts.create('user', JSON.stringify(user.data.login));
   }

   // Execute the function
   run().catch(console.error);
   ```

   This script initializes the Octokit client with the access token, fetches the authenticated user's data, and then saves the username as an artifact.

2. **Run the Script:**

   Execute your script with `mini-loader`:

   ```bash
   mini-loader loads push github.js -r -ai
   ```

### Managing Local Secrets

If you're running the script locally, you can manage secrets either by using a `.secrets` file or setting an environment variable.

1. **Using a `.secrets` File:**

   Create a file named `.secrets` and add your token:

   ```
   githubtoken=<your-token>
   ```

2. **Using Environment Variables:**

   Prefix your environment variable with `ML_S_` and run the script:

   ```bash
   ML_S_githubtoken=<your-token> mini-loader local run github.js -ai
   ```

### Conclusion

By following these steps, you can securely manage and use secrets within your workloads, enhancing the security and integrity of your applications.

[Next: Creating an API](./05-creating-an-api.md)
