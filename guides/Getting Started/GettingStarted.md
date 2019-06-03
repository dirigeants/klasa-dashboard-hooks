## Getting Started

klasa-dashboard-hooks (known as "KDH" for short) is a Klasa [plugin](https://klasa.js.org/#/docs/klasa/master/Other%20Subjects/Plugins) which allows you to easily run a HTTP server/API from your bot, which can be used for making a dashboard.

1. Install KDH

```bash
# NPM
$ npm i klasa-dashboard-hooks

# Yarn
$ yarn add klasa-dashboard-hooks
```

1. Enable the plugin, and pass in the Client Secret and Client ID of your bot. You can find these here: <https://discordapp.com/developers/applications/>

```js
Client.use(require('klasa-dashboard-hooks'));

new Client({
	clientSecret: 'CLIENT_SECRET_HERE',
	clientID: 'CLIENT_ID_HERE',
	dashboardHooks: {
		port: 3003
	}
}).login('TOKEN');
```

> The client secret should be kept **secret**, along with your bot token, neither should be exposed anywhere.

A HTTP server is now running on your local machine on port `3003`, if you're running it locally, you should be able to test it out by visiting `localhost:3003/api/application`

## Further reading

- {@tutorial CreatingRoutes}
- {@tutorial CreatingMiddlewares}
