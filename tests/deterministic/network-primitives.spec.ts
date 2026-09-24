import { test, expect } from '@playwright/test';
import net from 'node:net';
import tls from 'node:tls';
import http from 'node:http';
import https from 'node:https';
import http2 from 'node:http2';
import dns from 'node:dns';
import dgram from 'node:dgram';
import { spawnSync } from 'node:child_process';
import { requireDeterministicGuard } from '../../src/config/deterministic-guard.ts';

const primitives: [string, () => unknown][] = [
  ['TCP', () => net.connect(443, 'blocked.invalid')],
  ['TLS', () => tls.connect(443, 'blocked.invalid')],
  ['HTTP', () => http.get('http://blocked.invalid')],
  ['HTTPS', () => https.get('https://blocked.invalid')],
  ['HTTP/2', () => http2.connect('https://blocked.invalid')],
  ['WebSocket', () => new WebSocket('wss://blocked.invalid')],
  ['DNS lookup', () => dns.lookup('blocked.invalid', () => {})],
  ['DNS resolve', () => dns.resolve('blocked.invalid', () => {})],
  ['DNS promise', () => dns.promises.resolve4('blocked.invalid')],
  [
    'DNS resolver',
    () => new dns.Resolver().resolve4('blocked.invalid', () => {}),
  ],
  [
    'DNS promise resolver',
    () => new dns.promises.Resolver().resolve4('blocked.invalid'),
  ],
  ['UDP', () => dgram.createSocket('udp4')],
];
for (const [name, call] of primitives) {
  test(`network denial blocks ${name} before dispatch`, () => {
    expect(call).toThrow('Node network access is disabled');
  });
}
test('preload marker is present in the worker', () => {
  expect(requireDeterministicGuard).not.toThrow();
});
test('direct Playwright invocation fails closed without preload', () => {
  const result = spawnSync(
    process.execPath,
    ['node_modules/@playwright/test/cli.js', 'test', '--list'],
    { env: { ...process.env, NODE_OPTIONS: '' }, encoding: 'utf8' },
  );
  expect(result.status).not.toBe(0);
  expect(result.stderr + result.stdout).toContain(
    'Required network guard missing',
  );
});
