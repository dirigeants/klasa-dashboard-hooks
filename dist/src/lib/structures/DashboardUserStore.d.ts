import { DataStore } from '@klasa/core';
import type { DashboardUser } from './DashboardUser';
export declare class DashboardUserStore extends DataStore<DashboardUser> {
    fetch(token: string): Promise<DashboardUser>;
}
