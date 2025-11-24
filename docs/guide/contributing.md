# Contributing to Micro Automation Hub

We welcome contributions to the Micro Automation Hub! As an open-source project, we rely on the community to help us improve and grow.

## How to Contribute

1. **Fork the Repository:**
   Click the "Fork" button on the GitHub repository page to create your own copy of the project.

2. **Clone Your Fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/MAH.git
   cd MAH
   ```

3. **Create a Branch:**
   Create a new branch for your feature or bug fix.
   ```bash
   git checkout -b feature/my-new-feature
   ```

4. **Make Changes:**
   Implement your changes. Ensure you follow the existing code style and conventions.

5. **Test Your Changes:**
   Run the application locally to verify your changes work as expected.
   ```bash
   npm run dev
   ```

6. **Commit and Push:**
   Commit your changes with a descriptive message.
   ```bash
   git commit -m "Add feature: My new feature"
   git push origin feature/my-new-feature
   ```

7. **Submit a Pull Request:**
   Go to the original repository and open a Pull Request from your branch. Provide a clear description of your changes.

## Development Guidelines

- **Code Style:** We use ESLint and Prettier. Ensure your code is linted before submitting.
- **Database Changes:** If you modify the `schema.prisma` file, remember to create a migration:
  ```bash
  npm run db:migrate
  ```
- **Components:** Try to reuse existing components in `components/` whenever possible.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on the GitHub repository. Provide as much detail as possible to help us understand and address the problem.
