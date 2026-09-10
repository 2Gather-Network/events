#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Do the two copies of the event form still agree?

WHY THIS EXISTS. Jessie, 2026-09-10: "i have shown you hte same thigns over and over - why ?"

Because the event form lives in TWO files - events/index.html and myevents/manage/index.html -
and a patch that matches a string in the first changes that file, so the same string no longer
matches in the second. The script prints MISS and the change lands in one copy. She then sees the
old behaviour on the page she actually works from and has to report it again.

Run this after ANY change to the form, before saying anything about it:

    python3 check-form-copies.py

It exits non-zero when the copies disagree.
"""
import io, sys

A = io.open('events/index.html', encoding='utf-8').read()
B = io.open('myevents/manage/index.html', encoding='utf-8').read()

CHECKS = [
    ('start time default 09:00',      'type="time" value="09:00"'),
    ('Clear on the time boxes',       'clearTime('),
    ('Community selected by default', 'new Set(["community"])'),
    ('chip width capped',             'max-width:200px'),
    ('info buttons right',            '.field-label { display:flex'),
    ('Group link deleted',            'GROUP LINK IS GONE'),
    ('Organization above host',       'ORGANIZATION FIRST'),
    ('host placeholder',              'First and last name - shown on the event'),
    ('no hand emoji',                 'People registered (RSVPs)'),
    ('heading names the event',       'JUST THE NAME'),
    ('9am fills a blank',             '9am WHEREVER IT WOULD OTHERWISE BE BLANK'),
]

print('%-34s %-10s %s' % ('change', 'events/', 'myevents/manage/'))
print('-' * 66)
bad = 0
for name, needle in CHECKS:
    a, b = needle in A, needle in B
    if not (a and b):
        bad += 1
    print('%-34s %-10s %s' % (name, 'yes' if a else 'NO', 'yes' if b else 'NO'))
print('-' * 66)

if bad:
    print('OUT OF SYNC: %d of %d. Fix before saying anything about the form.' % (bad, len(CHECKS)))
    sys.exit(1)
print('Both copies agree on all %d.' % len(CHECKS))
