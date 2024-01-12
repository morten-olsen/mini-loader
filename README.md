

<p>
<center>
    <img src="./assets/logo.png" width="300" height="300">
</center>
</p>

# Welcome to Mini Loader! 🌐

Welcome to mini loader, a lightweight, Docker-based server solution for managing and executing workloads with ease. Designed for developers, small teams, and anyone in need of a simple yet powerful tool for running tasks, hosting API servers, or scheduling routine jobs.

## Features

- **Ease of Use**: Simple CLI for interacting with the server.
- **Flexibility**: Run one-off tasks, host small API servers, or schedule jobs using cron syntax.
- **Docker Integration**: Easily deployable as a Docker container.
- **Automatic Dependency Handling**: Auto-download of required packages.
- **Task Scheduling**: Built-in support for cron-like job scheduling.
- **HTTP Gateway**: Expose a HTTP server from your workloads

## Quick Start

Get up and running with mini loader in just a few steps:

1. **Install the CLI**: `npm install -g @morten-olsen/mini-loader-cli`
2. **Deploy the Server**:  `docker run -p 4500:4500 -n mini-loader ghcr.io/morten-olsen/mini-loader:main`.
3. **Push Your First Load**: `mini-loader loads push script.mjs -r -i first`
3. **See the logs**: `mini-loader logs ls -l first`

For a detailed guide on getting started, please refer to our [Getting Started Tutorial](./docs/getting-started.md).

## Support and Contributions

If you encounter any issues or would like to contribute to the project, please check out:

- [Issue Tracker](https://github.com/morten-olsen/mini-loader/issues)
- [Contribution Guidelines](./CONTRIBUTING.md)

## License

mini loader is open-source software licensed under the [MIT License](./LICENSE).

## Let's Get Started!

Dive into the world of simplified workload management with mini loader. Start with our [Getting Started Tutorial](./docs/getting-started.md) and unleash the full potential of your tasks and applications!
