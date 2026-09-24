import net from 'node:net';
import tls from 'node:tls';
import dns from 'node:dns';
import dgram from 'node:dgram';
import http from 'node:http';
import https from 'node:https';
import http2 from 'node:http2';
import { syncBuiltinESMExports } from 'node:module';

/** Block Node socket creation before DNS or transport; no rejected URL is logged. */
function denyNetwork() {
  throw new Error('Node network access is disabled in deterministic tests.');
}

net.Socket.prototype.connect = denyNetwork;
net.connect = denyNetwork;
net.createConnection = denyNetwork;
tls.connect = denyNetwork;
http.request = http.get = https.request = https.get = denyNetwork;
http2.connect = denyNetwork;
dgram.createSocket = denyNetwork;
dgram.Socket.prototype.send = denyNetwork;
dgram.Socket.prototype.connect = denyNetwork;
for (const object of [
  dns,
  dns.promises,
  dns.Resolver.prototype,
  dns.promises.Resolver.prototype,
]) {
  for (const key of Object.getOwnPropertyNames(object)) {
    if (/^(lookup|resolve|reverse)/.test(key)) object[key] = denyNetwork;
  }
}
globalThis.fetch = async () => denyNetwork();
globalThis.WebSocket = class {
  constructor() {
    denyNetwork();
  }
};
syncBuiltinESMExports();
Object.defineProperty(
  globalThis,
  Symbol.for('qe.deterministic-network-denied'),
  { value: true },
);
