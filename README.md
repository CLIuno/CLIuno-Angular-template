# Cliuno Angular template

<img src="./public/logo.png" style="width: 300px; height: 300px; padding-bottom: 30px;" alt="logo">

## Installation

if you want to run the project locally make sure you have installed nodejs, pnpm.
to install node js go to [nodejs](https://nodejs.org/en/download/)
to install pnpm run the following command

```bash
npm install -g pnpm
```

if you want to run the project using docker make sure you have installed docker.

to install docker go to [docker](https://docs.docker.com/get-docker/)

to run the project using docker run the following command

```bash
docker compose -d up
```

or pull the image from docker hub

```bash
docker pull iru44/angular-template
```

make sure you pull the database image from docker hub as well

then run the following command

```bash
docker run -p 3000:3000 iru44/angular-template
```

if you want to run the project using kubernetes make sure you have installed minikube.

to install minikube go to [minikube](https://minikube.sigs.k8s.io/docs/start/)
to install kubectl go to [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Clone the repository

```bash
git clone https://github.com/CLIuno/CLIuno-Express-template.git
```

then run the following command

```bash
pnpm install
```

## Usage

to run the project run the following command

```bash
pnpm dev
```

## Features

list of features that already implemented:

| Status             | Feature                       |
| ------------------ | ----------------------------- |
| [ ]                | Auth routes                   |
| [ ]                | User routes                   |
| [ ]                | Role routes                   |
| [ ]                | Post routes                   |
| [ ]                | User Role routes              |
| [ ]                | CI/CD with GitHub Actions     |
| :white_check_mark: | Mailer                        |
| :white_check_mark: | Logging                       |
| [ ]                | Dockerize                     |
| [ ]                | Kubernetes                    |
| [ ]                | Soft delete                   |
| :white_check_mark: | SQLite database               |
| [ ]                | Fully documentation           |
| :white_check_mark: | Postman collection just basic |

## Premium features

You will get more features if you buy the full version and you can use it for commercial purposes (contact me for more information)

| Status             | Feature                      |
| ------------------ | ---------------------------- |
| :white_check_mark: | Vote routes                  |
| :white_check_mark: | Comment routes               |
| :white_check_mark: | Permission routes            |
| :white_check_mark: | Reacion routes               |
| :white_check_mark: | Payment routes               |
| :white_check_mark: | Notification routes          |
| :white_check_mark: | Pagination                   |
| :white_check_mark: | Redis cache                  |
| :white_check_mark: | File upload                  |
| :white_check_mark: | Fully unit test              |
| :white_check_mark: | Database Factory             |
| :white_check_mark: | Make use of Enums            |
| :white_check_mark: | GraphQL (Optional)           |
| :white_check_mark: | Postman collection extra     |
| :white_check_mark: | Postgres database or MongoDB |

## list of endpoints

### Auth

| Status             | Endpoint Description    | Method | Path                             |
| ------------------ | ----------------------- | ------ | -------------------------------- |
| :white_check_mark: | Login                   | POST   | `/api/v1/auth/login`             |
| [ ]                | Register                | POST   | `/api/v1/auth/register`          |
| [ ]                | Logout                  | POST   | `/api/v1/auth/logout`            |
| :white_check_mark: | Reset Password          | POST   | `/api/v1/auth/reset-password`    |
| :white_check_mark: | Forgot Password         | POST   | `/api/v1/auth/forgot-password`   |
| :white_check_mark: | Change Password         | POST   | `/api/v1/auth/change-password`   |
| :white_check_mark: | Send Verification Email | POST   | `/api/v1/auth/send-verify-email` |
| :white_check_mark: | Verify Email            | POST   | `/api/v1/auth/verify-email`      |
| [ ]                | Check Token             | POST   | `/api/v1/auth/check-token`       |
| [ ]                | Refresh Token           | POST   | `/api/v1/auth/refresh-token`     |
| :white_check_mark: | Verify OTP              | POST   | `/api/v1/auth/otp/verify`        |
| :white_check_mark: | Disable OTP             | POST   | `/api/v1/auth/otp/disable`       |
| :white_check_mark: | Validate OTP            | POST   | `/api/v1/auth/otp/validate`      |
| :white_check_mark: | Generate OTP            | POST   | `/api/v1/auth/otp/generate`      |

### Users

| Status | Endpoint Description    | Method | Path                                 |
| ------ | ----------------------- | ------ | ------------------------------------ |
| [ ]    | Get all current user    | GET    | `/api/v1/users/current`              |
| [ ]    | Get user by username    | GET    | `/api/v1/users/username/:username`   |
| [ ]    | Get all users           | GET    | `/api/v1/users`                      |
| [ ]    | Get a user by ID        | GET    | `/api/v1/users/:id`                  |
| [ ]    | Update user by ID       | PATCH  | `/api/v1/users/:id`                  |
| [ ]    | Delete user by ID       | DELETE | `/api/v1/users/:id`                  |
| [ ]    | Get permissions by user | GET    | `/api/v1/users/:user_id/permissions` |
| [ ]    | Get posts by user       | GET    | `/api/v1/users/:user_id/posts`       |
| [ ]    | Get roles by user       | GET    | `/api/v1/users/:user_id/roles`       |

### Roles

| Status | Endpoint Description    | Method | Path                                 |
| ------ | ----------------------- | ------ | ------------------------------------ |
| [ ]    | Get all roles           | GET    | `/api/v1/roles`                      |
| [ ]    | Get role by ID          | GET    | `/api/v1/roles/:id`                  |
| [ ]    | Create a role           | POST   | `/api/v1/roles`                      |
| [ ]    | Update role by ID       | PATCH  | `/api/v1/roles/:id`                  |
| [ ]    | Delete role by ID       | DELETE | `/api/v1/roles/:id`                  |
| [ ]    | Get permissions by role | GET    | `/api/v1/roles/:role_id/permissions` |
| [ ]    | Get users by role       | GET    | `/api/v1/roles/:role_id/users`       |

### Posts

| Status | Endpoint Description       | Method | Path                          |
| ------ | -------------------------- | ------ | ----------------------------- |
| [ ]    | Get all current user posts | GET    | `/api/v1/posts/current-user`  |
| [ ]    | Get all posts              | GET    | `/api/v1/posts`               |
| [ ]    | Get post by ID             | GET    | `/api/v1/posts/:id`           |
| [ ]    | Create a post              | POST   | `/api/v1/posts`               |
| [ ]    | Update post by ID          | PATCH  | `/api/v1/posts/:id`           |
| [ ]    | Delete post by ID          | DELETE | `/api/v1/posts/:id`           |
| [ ]    | Get users by post          | GET    | `/api/v1/posts/:post_id/user` |

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
