# Base UI Navigation Menu Controlled Close Repro

This reproduces the controlled close collapse in `@base-ui/react@1.4.1`.

1. Run the project.
2. Click **Close externally** or uncheck **Menu open**.
3. On the broken version, the popup collapses while the exit transition is running.

To verify a fix, change the `@base-ui/react` dependency to the candidate version and repeat the same close path.
