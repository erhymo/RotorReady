#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const secureEnv = process.env.ROTORREADY_GOOGLEPLAY_ENV
  || join(homedir(), 'Mayday/Secure/RotorReady/GooglePlay/playstore.env');
const requiredEnv = ['GOOGLE_PLAY_PACKAGE_NAME', 'GOOGLE_PLAY_JSON_KEY_PATH'];
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
  return { code: result.status ?? 1, stdout: (result.stdout || '').trim(), stderr: (result.stderr || '').trim() };
}

function which(bin) {
  const result = run('bash', ['-lc', `command -v ${bin}`]);
  return result.code === 0 ? result.stdout.split('\n')[0] : '';
}

function version(label, bin, args) {
  if (!which(bin)) return fail(`${label} is missing (${bin})`);
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

console.log('RotorReady Google Play release doctor');
console.log('=====================================');
version('Homebrew', 'brew', ['--version']);
version('fastlane', 'fastlane', ['--version']);
version('Java', 'java', ['-version']);
version('Gradle wrapper', 'bash', ['-lc', 'cd android && ./gradlew --version | head -1']);
version('Capacitor CLI', 'npx', ['cap', '--version']);
version('keytool', 'keytool', ['-help']);

console.log('\nAndroid signing');
console.log('---------------');
if (!existsSync('android/keystore.properties')) fail('Missing android/keystore.properties');
else {
  ok('android/keystore.properties exists');
  const props = parseEnv('android/keystore.properties');
  for (const key of ['storeFile', 'storePassword', 'keyAlias', 'keyPassword']) {
    props[key] ? ok(`${key}=<redacted>`) : fail(`Missing ${key}`);
  }
  if (props.storeFile) {
    const storePath = join(root, 'android', props.storeFile);
    existsSync(storePath) ? ok(`Keystore exists (${basename(storePath)})`) : fail(`Keystore missing (${basename(storePath)})`);
  }
}

console.log('\nGoogle Play API config');
console.log('----------------------');
if (!existsSync(secureEnv)) {
  fail(`Missing secure env file: ${secureEnv}`);
  info('Create it after downloading a Google Play Developer API service account JSON key.');
} else {
  const mode = (statSync(secureEnv).mode & 0o777).toString(8);
  ok(`Secure env file exists (${mode})`);
  const env = parseEnv(secureEnv);
  for (const key of requiredEnv) env[key] ? ok(`${key}=<redacted>`) : fail(`Missing ${key}`);
  env.GOOGLE_PLAY_TRACK ? ok('GOOGLE_PLAY_TRACK=<redacted>') : warn('GOOGLE_PLAY_TRACK missing; fastlane defaults to internal');
  if (env.GOOGLE_PLAY_JSON_KEY_PATH) {
    const keyPath = env.GOOGLE_PLAY_JSON_KEY_PATH;
    if (!existsSync(keyPath)) fail(`JSON key file missing (${basename(keyPath)})`);
    else {
      ok(`JSON key file exists (${basename(keyPath)})`);
      try {
        const json = JSON.parse(readFileSync(keyPath, 'utf8'));
        json.type === 'service_account' ? ok('JSON key type is service_account') : fail('JSON key is not a service_account');
        json.client_email ? ok('JSON key has client_email=<redacted>') : fail('JSON key missing client_email');
        json.private_key ? ok('JSON key has private_key=<redacted>') : fail('JSON key missing private_key');
      } catch {
        fail('JSON key file is not valid JSON');
      }
    }
  }
}

console.log('\nProject checks');
console.log('--------------');
existsSync('android/fastlane/Fastfile') ? ok('Android Fastfile exists') : fail('Missing android/fastlane/Fastfile');
const syntax = run('ruby', ['-c', 'android/fastlane/Fastfile']);
syntax.code === 0 ? ok('Android Fastfile syntax OK') : fail('Android Fastfile syntax failed');
existsSync('android/app/build.gradle') ? ok('Android Gradle project exists') : fail('Missing android/app/build.gradle');
existsSync('android/app/build/outputs/bundle/release/app-release.aab')
  ? ok('Release AAB exists')
  : warn('Release AAB not built yet; run npm run android:bundle');

if (process.argv.includes('--api')) {
  console.log('\nGoogle Play API validation');
  console.log('--------------------------');
  const env = { ...process.env, FASTLANE_OPT_OUT_USAGE: '1', FASTLANE_SKIP_UPDATE_CHECK: '1' };
  const api = run('fastlane', ['validate_play'], { cwd: join(root, 'android'), env });
  api.code === 0 ? ok('fastlane validate_play succeeded') : fail('fastlane validate_play failed');
} else {
  info('Skip API call. Run `npm run googleplay:doctor -- --api` after Play API JSON is configured.');
}

const git = run('git', ['status', '--short']);
git.code === 0 && !git.stdout ? ok('Git working tree clean') : warn('Git working tree has local changes');

console.log('\nResult');
console.log('------');
if (failures === 0) ok('Google Play release environment looks ready');
else fail(`${failures} required check(s) failed`);
process.exit(failures === 0 ? 0 : 1);