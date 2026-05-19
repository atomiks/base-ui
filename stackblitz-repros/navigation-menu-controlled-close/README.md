# Base UI Navigation Menu Controlled Close Repro

This verifies the controlled close fix from `mui/base-ui#4855` using the PR package from `pkg.pr.new`.

1. Run the project.
2. Click **Close externally** or uncheck **Menu open**.
3. The popup should keep its measured width and height while the exit transition is running.

To reproduce the original bug, change the `@base-ui/react` dependency to `1.4.1` and repeat the same close path.
