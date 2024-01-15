## Anti-Features

### Understanding the Limitations

While mini loader is designed for simplicity and ease of use, it's important to understand its limitations, especially regarding task isolation and scalability. This section outlines these "anti-features" to help you assess if mini loader is the right tool for your needs.

### No Task Isolation

- **Process-Based Execution**: In mini loader, each task is run as a process on the server. This means there isn't any task isolation. If task isolation is crucial for your use case (e.g., running untrusted code), mini loader might not be the ideal solution.

### Limited Scalability

- **Single-Server Design**: The architecture of mini loader is oriented towards simplicity and ease of use on a single server. As such, it does not support horizontal scaling or load distribution across multiple servers. If your project requires high scalability to handle large-scale workloads, you might want to consider other tools that are designed for such environments.

### Aimed at Simplicity, Not Scale

The core philosophy of mini loader is to provide a straightforward, user-friendly platform for managing and executing workloads. It's particularly well-suited for individual developers, small teams, or small-scale applications where the ease of setup and use is prioritized over the ability to scale or isolate tasks.

For those who need advanced features like task isolation or high scalability, there are other more complex tools available that might better suit those specific requirements.