import type { LoggerEvent } from './logger/logger.js';
import type { ArtifactCreateEvent } from './artifacts/artifacts.js';

type Event = LoggerEvent | ArtifactCreateEvent;

export type { Event, LoggerEvent, ArtifactCreateEvent };
export { logger } from './logger/logger.js';
export { artifacts } from './artifacts/artifacts.js';
export { input } from './input/input.js';
export { secrets } from './secrets/secrets.js';
export { http } from './http/http.js';
