import { io } from 'socket.io-client';
// "undefined" means the URL will be computed from the `window.location` object
const NODE_JS_PORT = 8800

const URL = "http://localhost:" +NODE_JS_PORT;

export const socket = io(URL);