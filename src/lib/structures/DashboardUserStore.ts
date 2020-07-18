import { DataStore } from '@klasa/core';
import fetch from 'node-fetch';
import type { DashboardUser } from './DashboardUser';

export class DashboardUserStore extends DataStore<DashboardUser> {

	async fetch(token: string): Promise<DashboardUser> {
		token = `Bearer ${token}`;
		const user = await fetch('https://discordapp.com/api/users/@me', { headers: { Authorization: token } })
			.then(result => result.json());
		user.guilds = await fetch('https://discordapp.com/api/users/@me/guilds', { headers: { Authorization: token } })
			.then(result => result.json());
		// eslint-disable-next-line dot-notation
		return this['_add'](user);
	}

}
