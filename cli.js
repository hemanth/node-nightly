#!/usr/bin/env node
'use strict';
var kexec = require('kexec');
var nodeNightly = require('./');
var existsSync = require('fs').existsSync
var args = process.argv.slice(2);

!existsSync('./node-nightly') ? nodeNightly.install() : kexec('./node-nightly/bin/node', args)
