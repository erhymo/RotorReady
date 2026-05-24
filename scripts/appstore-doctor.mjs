#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const root = process.cwd();
const secureEnv = process.env.ROTORREADY_APPSTORE_ENV
  || join(homedir(), 'Mayday/Secure/RotorReady/AppStore/appstore.env');
const requiredEnv = [
  'APP_STORE_CONNECT_KEY_ID',
  'APP_STORE_CONNECT_ISSUER_ID',
  'APP_STORE_CONNECT_KEY_PATH',
  'APP_IDENTIFIER',
  'APPLE_TEAM_ID',
];

let failures = 0;
const ok = (msg) => console.log(`✅ ${msg}`);
const warn = (msg) => console.log(`⚠️  ${msg}`);
const fail = (msg) => { failures += 1; console.log(`❌ ${msg}`); };
const info = (msg) => console.log(`ℹ️  ${msg}`);

function run(cmd, args = [], opts = {}) {
  const result = spawnSync(cmd, args, {
    cwd: opts.cwd || root,
    encoding: 'utf8',
    env: opts.env || process.env,
  });
  return {
    code: result.status ?? 1,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function which(bin) {
  const result = run('bash', ['-lc', `command -v ${bin}`]);
  return result.code === 0 ? result.stdout.split('\n')[0] : '';
}

function version(label, bin, args) {
  const path = which(bin);
  if (!path) return fail(`${label} is missing (${bin})`);
  const result = run(bin, args);
  const firstLine = (result.stdout || result.stderr).split('\n').filter(Boolean)[0] || 'installed';
  ok(`${label}: ${firstLine}`);
}

function parseEnv(file) {
  const env = {};
  if (!existsSync(file)) return env;
  for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const [key, ...rest] = line.split('=');
    env[key] = rest.join('=');
  }
  return env;
}

console.log('RotorReady App Store release doctor');
console.log('===================================');

version('Homebrew', 'brew', ['--version']);
version('fastlane', 'fastlane', ['--version']);
version('Xcode', 'xcodebuild', ['-version']);
version('CocoaPods', 'pod', ['--version']);
version('Capacitor CLI', 'npx', ['cap', '--version']);

const firstLaunch = run('xcodebuild', ['-checkFirstLaunchStatus']);
firstLaunch.code === 0 ? ok('Xcode first-launch setup complete') : fail('Xcode first-launch setup is incomplete');

const runtimes = run('xcrun', ['simctl', 'list', 'runtimes']);
if (runtimes.code === 0 && /iOS 26\.5/.test(runtimes.stdout)) ok('iOS 26.5 simulator/runtime installed');
else warn('iOS 26.5 runtime not found; run: xcodebuild -downloadPlatform iOS');

console.log('\nLocal App Store Connect config');
console.log('------------------------------');
if (!existsSync(secureEnv)) {
  fail(`Missing secure env file: ${secureEnv}`);
} else {
  const mode = (statSync(secureEnv).mode & 0o777).toString(8);
  ok(`Secure env file exists (${mode})`);
  const env = parseEnv(secureEnv);
  for (const key of requiredEnv) env[key] ? ok(`${key}=<redacted>`) : fail(`Missing ${key}`);
  if (env.APP_STORE_CONNECT_KEY_PATH) {
    const keyPath = env.APP_STORE_CONNECT_KEY_PATH;
    if (existsSync(keyPath)) ok(`Private key file exists (${basename(keyPath)})`);
    else fail(`Private key file missing (${basename(keyPath)})`);
  }
}

console.log('\nProject checks');
console.log('--------------');
existsSync('ios/fastlane/Fastfile') ? ok('Fastfile exists') : fail('Missing ios/fastlane/Fastfile');
existsSync('ios/App/App.xcworkspace') ? ok('Xcode workspace exists') : fail('Missing ios/App/App.xcworkspace');

const syntax = run('ruby', ['-c', 'ios/fastlane/Fastfile']);
syntax.code === 0 ? ok('Fastfile syntax OK') : fail('Fastfile syntax failed');

if (process.argv.includes('--api')) {
  console.log('\nApp Store Connect API validation');
  console.log('--------------------------------');
  const env = { ...process.env, FASTLANE_OPT_OUT_USAGE: '1', FASTLANE_SKIP_UPDATE_CHECK: '1' };
  const api = run('fastlane', ['validate_api'], { cwd: join(root, 'ios'), env });
  api.code === 0 ? ok('fastlane validate_api succeeded') : fail('fastlane validate_api failed');
} else {
  info('Skip API call. Run `npm run appstore:doctor -- --api` to validate App Store Connect.');
}

const git = run('git', ['status', '--short']);
git.code === 0 && !git.stdout ? ok('Git working tree clean') : warn('Git working tree has local changes');

console.log('\nResult');
console.log('------');
if (failures === 0) ok('Release environment looks ready');
else fail(`${failures} required check(s) failed`);
process.exit(failures === 0 ? 0 : 1);