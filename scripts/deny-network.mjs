import net from 'node:net';
import tls from 'node:tls';
import { syncBuiltinESMExports } from 'node:module';

/** Block Node socket creation before DNS or transport; no rejected URL is logged. */
function denyNetwork() {
  throw new Error('Node network access is disabled in deterministic tests.');
}

net.Socket.prototype.connect = denyNetwork;
net.connect = denyNetwork;
net.createConnection = denyNetwork;
tls.connect = denyNetwork;
globalThis.fetch = async () => denyNetwork();
syncBuiltinESMExports();
