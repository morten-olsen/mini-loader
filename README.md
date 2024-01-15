![banner](./assets/banner.png)

# Welcome to Mini Loader! 🌐

Welcome to mini loader, a lightweight server solution for managing and executing workloads with ease. Designed for developers, small teams, and anyone in need of a simple yet powerful tool for running tasks, hosting API servers, or scheduling routine jobs.

## Features

- **Ease of Use**: Simple CLI for interacting with the server.
- **Flexibility**: Run one-off tasks, host small API servers, or schedule jobs using cron syntax.
- **Docker Integration**: Easily deployable as a Docker container.
- **Automatic Dependency Handling**: Auto-download of required packages.
- **Task Scheduling**: Built-in support for cron-like job scheduling.
- **HTTP Gateway**: Expose a HTTP server from your workloads

Also see [anti-features and limitations](./docs/02-anti-features.md)

:construction: This project is under active development and has not reached v1.0 yet. Expect some bugs and potential breaking changes in APIs. We appreciate your patience and welcome your feedback as we work towards a stable release!

For an overview of what's coming next, check out our roadmap at [GitHub Milestones](https://github.com/morten-olsen/mini-loader/milestones).

## Quick Start

Get up and running with mini loader in just a few steps:

```bash
# Install the CLI and the server
npm i -g @morten-olsen/mini-loader-cli @morten-olsen/mini-loader-server @morten-olsen/mini-loader-runner 

# Start the server
mini-loader-server start &

# Get your access token
mini-loader-server create-token

# Authenticate the CLI
mini-loader auth login

# Push your first workload
mini-loader loads push -r -ai my-script.js -i first

# See the output logs
mini-loader logs ls -l first
```

For a detailed guide on getting started, please refer to the [Getting Started Tutorial](./docs/01-getting-started.md).

## Support and Contributions

If you encounter any issues or would like to contribute to the project, please check out:

- [Issue Tracker](https://github.com/morten-olsen/mini-loader/issues)
- [Contribution Guidelines](./CONTRIBUTING.md)

## License

mini loader is open-source software licensed under the [GPL-3 License](./LICENSE).

## Let's Get Started!

Dive into the world of simplified workload management with mini loader. Start with our [Getting Started Tutorial](./docs/01-getting-started.md) and unleash the full potential of your tasks and applications!
