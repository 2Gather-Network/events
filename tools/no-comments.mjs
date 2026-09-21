import { readFileSync } from 'node:fs';
import { parse } from 'acorn';

const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const HTML_COMMENT = /<!--([\s\S]*?)-->/g;
const KEEP = /^\s*(@license|@preserve|!|Copyright\b)|^\s*V\d+\.\d+\s*$/;

function lineOf(src, index) { return src.slice(0, index).split('\n').length; }

function jsComments(code, offset, src, found, file) {
  const comments = [];
  try {
    parse(code, { ecmaVersion: 'latest', sourceType: 'script', onComment: comments, locations: false });
  } catch {
    try {
      parse(code, { ecmaVersion: 'latest', sourceType: 'module', onComment: comments, locations: false });
    } catch { return; }
  }
  for (const c of comments) {
    if (KEEP.test(c.value)) continue;
    found.push({ file, line: lineOf(src, offset + c.start), text: c.value.trim().split('\n')[0].slice(0, 70) });
  }
}

export function check(file) {
  const src = readFileSync(file, 'utf8');
  const found = [];
  if (/\.m?js$/i.test(file)) {
    jsComments(src, 0, src, found, file);
    return found;
  }
  let m;
  while ((m = SCRIPT.exec(src))) {
    if (/\bsrc\s*=/i.test(m[1])) continue;
    if (/\btype\s*=\s*["'](?!text\/javascript|module|application\/javascript)/i.test(m[1])) continue;
    jsComments(m[2], m.index + m[0].indexOf(m[2]), src, found, file);
  }
  while ((m = HTML_COMMENT.exec(src))) {
    const body = m[1].trim();
    if (!body || /^\[if /i.test(body) || KEEP.test(body)) continue;
    found.push({ file, line: lineOf(src, m.index), text: body.split('\n')[0].slice(0, 70) });
  }
  return found;
}

const files = process.argv.slice(2);
if (files.length) {
  let all = [];
  for (const f of files) { try { all = all.concat(check(f)); } catch {} }
  if (all.length) {
    console.log('Comments found in pages that ship to the public site.\n');
    console.log('The pages are public and anyone can read them, so our reasoning, our decisions and');
    console.log('our internal notes do not go in them. Code only. Explanation goes in the queue log');
    console.log('or in design/ in The-New-Build-Repository.\n');
    for (const c of all) console.log(`  ${c.file}:${c.line}  ${c.text}`);
    console.log(`\n${all.length} comment${all.length === 1 ? '' : 's'}.`);
    process.exit(1);
  }
  console.log(`No comments in ${files.length} file${files.length === 1 ? '' : 's'}.`);
}
