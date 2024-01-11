First let’s install the CLI, which allow us to interact with a mini-loader server, but also run our workloads locally to validate that they are working

```bash
npm install -g @morten-olsen/mini-loader-cli
```

Next we need a script - let’s start simple with a script which will just output a single artifact called “hello”

```javascript
import { artifacts } from "@morten-olsen/mini-loader";

artifacts.create('hello', 'world');
```

We save our script as `script.mjs`

Note that we are referencing a package we don’t have. mini-loader support automatically downloading packages when it prepares the script. We could also have initialised a node project and installed the dependency (useful if you are using typescript and want typings)

Next we want to execute our script locally to validate that it actually works as we intended

```bash
mini-loader local run script.mjs -ai
```

Note the `-ai` which tells the CLI to download any packages referenced when it bundles the script

This should output that the script indeed created a new artifact named “hello”

[Next: setting up the server](./setup-server.md)