import { dirname } from 'path';
import { fileURLToPath } from 'url';
const filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(filename);


export const RandomNumber = (min, max) => Math.round((Math.random()) * (max + min) + min)

