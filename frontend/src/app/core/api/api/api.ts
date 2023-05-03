export * from './events-api.service';
import { EventsApiService } from './events-api.service';
export * from './events-api.serviceInterface';
export * from './users-api.service';
import { UsersApiService } from './users-api.service';
export * from './users-api.serviceInterface';
export const APIS = [EventsApiService, UsersApiService];
