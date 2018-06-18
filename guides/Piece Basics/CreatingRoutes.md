Routes are http request/response handlers for the route specfied. New routes are created in the `./routes/` folder.

```javascript
const { Route } = require('klasa-dashboard-hooks');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, {
			route: '/',
			authenticated: false
		});
	}

	get(request, response) {
		// This is where you place the code you want to run for get requests
	}

	post(request, response) {
		// This is where you place the code you want to run for post requests
	}

	patch(request, response) {
		// This is where you place the code you want to run for patch requests
	}

	delete(request, response) {
		// This is where you place the code you want to run for delete requests
	}

	// ect

};
```

The http methods in {@link Route} takes 2 parameters:

| Name             | Type                             | Description                |
| ---------------- | -------------------------------- | -------------------------- |
| **request**      | {@link KlasaIncomingMessage}     | The incomming request      |
| **response**     | {@link external:ServerResponse}  | The outgoing response      |

```javascript
const { Route } = require('klasa-dashboard-hooks');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, { route: 'users' });
	}

	get(request, response) {
		return response.end(JSON.stringify(this.client.users.keyArray()));
	}

};
```

How does the route work?

1. A get request is made to your api at the `/users` route like: api.yourdomain.com/users
2. After all {@link Middleware} have run, the code in the get method is run.
3. You end the response with strinified json of the `this.client.users.keyArray()`

Static routes are all and good, but you are more likely going to need some dynamic routes too:

```javascript
const { Route } = require('klasa-dashboard-hooks');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, { route: 'users/:userID' });
	}

	get(request, response) {
		const { userID } = request.params;
		const user = this.client.users.get(userID);
		if (!user) response.end('{}');
		return response.end(JSON.stringify(user));
	}

};
```

>Note the colon in front of the userID portion of the route

How does the new route work?

1. A get request is made to your api at the `/users/:userID` route like: api.yourdomain.com/users/167383252271628289
2. After all {@link Middleware} have run, the code in the get method is run.
3. You access the userID variable from the `request.params`
4. After trying to get the user from your cache, you either respond with `'{}'` or the stringified user.

# Further reading

- {@tutorial CreatingMiddlewares}
