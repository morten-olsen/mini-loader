## Interacting with the server

The mini loader CLI is your primary tool for interacting with the server. This guide will walk you through the basic commands and their usage.

### Getting Help

For assistance with any command, append `--help` to it. For example, to see documentation for the `loads push` command:

```bash
mini-loader loads push --help
```

### Push a Load to the Server

To push a script to your server:

```bash
mini-loader loads push <script-path> -i <id>
```

- `<id>` is the identifier for your script. If omitted, an ID will be auto-generated.
- To immediately trigger a run of the load after pushing, add the `-r` flag.

### Checking Run Status

To list the status of all runs:

```bash
mini-loader runs ls
```

- To filter runs by a specific load, add `-l <load-id>`.

### Retrieving Logs

To view logs:

```bash
mini-loader logs ls
```

- To view logs from a specific run, use `-r <run-id>`.
- To view logs for a specific load, use `-l <load-id>`.

### Listing Artifacts

To list all artifacts:

```bash
mini-loader artifacts ls
```

- You can filter the artifacts by a specific run using `-r <run-id>`.
- Alternatively, filter by load using `-l <load-id>`.

### Downloading an Artifact

To download a specific artifact:

```bash
mini-loader artifacts pull <id> myfile.txt
```

Replace `<id>` with the identifier of the artifact you wish to download.

### Ready for More?

You're now equipped to manage loads, runs, logs, and artifacts using the mini loader CLI. For advanced usage, such as managing secrets, proceed to the next section.

[Next: Managing Secrets](./04-managing-secrets.md)
