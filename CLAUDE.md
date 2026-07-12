# CLIuno Angular template

Angular 19 (standalone components) implementing the CLIuno demo app (auth, users, todos,
posts+comments, follows) against the shared CLIuno REST contract.

## Commands

```bash
pnpm start      # ng serve
pnpm build      # ng build
pnpm test       # ng test (karma/jasmine)
pnpm lint       # oxlint (there is no `ng lint` builder anymore)
pnpm format     # oxfmt src/
```

## Structure

- `src/app/services/*-api.service.ts` — the API layer (`AuthApiService`, `UserApiService`,
  `TodoApiService`, `PostApiService`, `FollowApiService`) on `HttpService`, which prefixes
  `environment.apiUrl` (default `http://localhost:3000/api/v1`) and adds the Bearer token.
- `src/app/views/` — pages; `src/app/types/models.ts` — shared interfaces;
  `src/environments/` — set `apiUrl` per environment (build-time, not env vars).

## The API contract (what backends guarantee)

Login sends `{usernameOrEmail, password}` and reads `data.token`. Responses are typed as
`ApiResponse<T>` = `{status, message, data}` with exact keys `data.users/user/todos/`
`todo/posts/post/followers/following/isFollowing`. Any CLIuno backend template serves
this contract. Keep all URLs inside the services.

## Conventions

- oxc tooling: `oxlint` + `oxfmt` (`semi: false`, single quotes); prettier for
  html/scss/md. No angular-eslint.
- **TypeScript stays <5.7** (Angular 19 pins it) — don't bump to 6.x here.
- Conventional commits (commitlint + husky); Tailwind v4 + daisyUI with `tw:` prefix.
