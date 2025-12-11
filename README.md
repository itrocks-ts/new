[![npm version](https://img.shields.io/npm/v/@itrocks/new?logo=npm)](https://www.npmjs.org/package/@itrocks/new)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/new)](https://www.npmjs.org/package/@itrocks/new)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/new?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/new)
[![issues](https://img.shields.io/github/issues/itrocks-ts/new)](https://github.com/itrocks-ts/new/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# new

Generic action-based new object form in HTML and JSON.

*This documentation was written by an artificial intelligence and may contain errors or approximations.
It has not yet been fully reviewed by a human. If anything seems unclear or incomplete,
please feel free to contact the author of this package.*

## Installation

```bash
npm i @itrocks/new
```

## Usage

`@itrocks/new` provides a ready‑made `New` action that builds on top of
[@itrocks/edit](https://github.com/itrocks-ts/edit) to render a form for
creating a fresh instance of a domain object.

It is typically used together with the it.rocks framework and routing
stack. You usually:

1. Declare a domain class (for example `User`).
2. Attach a `New<User>` action to this class in your action pack.
3. Expose a `/new` route that serves the HTML form and a JSON API
   variant for asynchronous front‑ends.

### Minimal example

```ts
import { New } from '@itrocks/new'
import type { Request } from '@itrocks/action-request'

class User {
	name  = ''
	email = ''
}

// Create an action dedicated to creating new User instances
const newUser = new New<User>()

// HTML form endpoint
async function newUserHtml (request: Request<User>) {
	return newUser.html(request)
}

// JSON endpoint (for SPA / XHR based UI)
async function newUserJson (request: Request<User>) {
	return newUser.json(request)
}
```

The `Request<User>` is usually created by
[@itrocks/action-request](https://github.com/itrocks-ts/action-request)
from an incoming HTTP request.

## API

### `class New<T extends object = object> extends Edit<T>`

`New` specialises the generic
[`Edit`](https://github.com/itrocks-ts/edit#class-editt-extends-object--object)
action for the "create new object" use case.

From the implementation you can see that it is decorated with:

- `@Need(NOTHING)` – the action does not require an existing object
  instance; it is responsible for providing an empty object to edit.
- `@Route('/new')` – declares a conventional `/new` route when used with
  [@itrocks/route](https://github.com/itrocks-ts/route).

It inherits all the behaviour of `Edit<T>` (form rendering, value
binding, validation glue, etc.) but always targets a *new* instance
instead of loading an existing one.

#### Type parameter

- `T` – The domain object type for which you want a "new" form (for
  example `User`).

#### Methods

Because `New<T>` extends `Edit<T>`, it exposes the same public methods
as `Edit`:

##### `html(request: Request<T>): Promise<HtmlResponse>`

Builds an HTML form used to create a new instance of `T`.

Typical usage in a route handler:

```ts
fastify.get('/users/new', async (req, reply) => {
	const request = toActionRequest<User>(req)
	const response = await newUser.html(request)
	reply
		.status(response.status)
		.headers(response.headers)
		.type('text/html')
		.send(response.body)
})
```

##### `json(request: Request<T>): Promise<JsonResponse>`

Returns a JSON representation of the same "new" form state. This is
useful for client‑side form rendering in SPA or mobile applications.

```ts
fastify.get('/api/users/new', async (req, reply) => {
	const request = toActionRequest<User>(req)
	const response = await newUser.json(request)
	reply
		.status(response.status)
		.headers(response.headers)
		.send(response.body)
})
```

## Typical use cases

- Provide a conventional `/new` screen for any business entity (user,
  product, order, etc.).
- Expose a JSON API for front‑end frameworks that render their own
  forms while relying on the same action logic as the HTML variant.
- Share a consistent way to create new objects across several projects
  by reusing the `New<T>` action instead of rewriting boilerplate
  controllers.
