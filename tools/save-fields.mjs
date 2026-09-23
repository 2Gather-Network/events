#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GS_DIR = process.env.CW_GS_DIR || join(homedir(), 'Documents', 'creating-works-gs');

const CHECKS = [
  { page: 'ikigai/index.html', action: 'saveIntro' },
  { page: 'ikigai/index.html', action: 'saveIntake' },
  { page: 'ikigai/index.html', action: 'savePermissions' },
  { page: 'me/index.html', action: 'saveIntake' },
  { page: 'me/index.html', action: 'saveBookmark' }
];

const ALWAYS = new Set(['action', 'nocache', 'meToken', 't', '_', 'callback']);

function stripComments(src) {
  let out = '', i = 0, q = null;
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (q) {
      out += c;
      if (c === '\\') { out += d || ''; i += 2; continue; }
      if (c === q) q = null;
      i++; continue;
    }
    if (c === '"' || c === "'" || c === '`') { q = c; out += c; i++; continue; }
    if (c === '/' && d === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    out += c; i++;
  }
  return out;
}

function functionBody(src, name) {
  const at = src.search(new RegExp('function\\s+' + name + '\\s*\\('));
  if (at < 0) return '';
  let i = src.indexOf('{', at), depth = 0;
  for (let j = i; j < src.length; j++) {
    if (src[j] === '{') depth++;
    else if (src[j] === '}') { depth--; if (depth === 0) return src.slice(at, j + 1); }
  }
  return src.slice(at);
}

function pageFields(file, action) {
  const src = readFileSync(join(ROOT, file), 'utf8');
  const introKeys = [...src.matchAll(/key:\s*'(intro[A-Za-z]+)'/g)].map(m => m[1]);
  const fields = new Set(), dynamic = [];
  let from = 0, sites = 0;
  const marker = 'action=' + action;
  while ((from = src.indexOf(marker, from)) > -1) {
    const rest = src.slice(from);
    const ends = [rest.indexOf('fetch('), rest.indexOf('return ')].filter(n => n > 0);
    let span = rest.slice(0, Math.min(...ends, 6000));
    for (const m of span.matchAll(/\b(gp[A-Za-z]*Qs)\(\)/g)) span += '\n' + functionBody(src, m[1]);
    for (const m of span.matchAll(/[?&]([A-Za-z_][A-Za-z0-9_]*)=/g)) fields.add(m[1]);
    const skipped = new Set([...span.matchAll(/q\.key\s*===\s*'(\w+)'\s*\)\s*return/g)].map(m => m[1]));
    if (/'&'\s*\+\s*(q\.key|k)\s*\+\s*'='/.test(span)) introKeys.filter(k => !skipped.has(k)).forEach(k => fields.add(k));
    else if (/'&'\s*\+\s*[A-Za-z_.]+\s*\+/.test(span)) dynamic.push(from);
    from += marker.length; sites++;
  }
  return { fields, sites, dynamic };
}

function backendBranch(action) {
  const files = existsSync(GS_DIR) ? ['Code.js'].map(f => join(GS_DIR, f)).filter(existsSync) : [];
  for (const f of files) {
    const src = stripComments(readFileSync(f, 'utf8'));
    const m = src.match(new RegExp('action\\s*===\\s*["\']' + action + '["\']\\s*\\)\\s*\\{'));
    if (!m) continue;
    const start = m.index;
    const next = src.slice(start + m[0].length).search(/\}\s*else\s+if\s*\(\s*action\s*===/);
    return src.slice(start, next < 0 ? undefined : start + m[0].length + next);
  }
  return null;
}

function backendFields(action) {
  const body = backendBranch(action);
  if (body === null) return null;
  const names = new Set();
  for (const m of body.matchAll(/e\.parameter\.([A-Za-z_][A-Za-z0-9_]*)/g)) names.add(m[1]);
  for (const m of body.matchAll(/e\.parameter\[\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*\]/g)) names.add(m[1]);
  const generic = /e\.parameter\[\s*[A-Za-z_]\w*\s*\]|sent\(\s*[A-Za-z_]\w*\s*\)/.test(body);
  if (generic) {
    for (const m of body.matchAll(/['"]([A-Za-z_][A-Za-z0-9_]*)['"]/g)) names.add(m[1]);
    for (const m of body.matchAll(/[{,]\s*([A-Za-z_][A-Za-z0-9_]*)\s*:/g)) names.add(m[1]);
  }
  return names;
}

let bad = 0;
if (!existsSync(join(GS_DIR, 'Code.js'))) {
  console.log('No backend copy at ' + GS_DIR + '. Set CW_GS_DIR to the creating-works-gs folder.');
  process.exit(2);
}
for (const c of CHECKS) {
  const p = pageFields(c.page, c.action);
  if (!p.sites) { console.log(`${c.page} → ${c.action}: the page no longer calls it`); continue; }
  const b = backendFields(c.action);
  if (!b) { console.log(`${c.page} → ${c.action}: NO BACKEND BRANCH FOUND`); bad++; continue; }
  const missing = [...p.fields].filter(f => !ALWAYS.has(f) && !b.has(f)).sort();
  const line = `${c.page} → ${c.action}: ${p.fields.size} fields sent`;
  if (missing.length) { bad++; console.log(line + `, NOT READ BY THE BACKEND: ${missing.join(', ')}`); }
  else console.log(line + ', all read by the backend');
  if (p.dynamic.length) console.log(`   a field name is built at run time near character ${p.dynamic.join(', ')}; add it to this check by hand`);
}
console.log(bad ? `\n${bad} save(s) send a field the backend never reads. Those saves drop it and still say ok.` : '\nEvery field sent is read.');
console.log('This checks the backend code on this Mac, not the deployed version, and not whether the column exists on the tab.');
process.exit(bad ? 1 : 0);
