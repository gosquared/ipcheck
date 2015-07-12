# IPCheck

[![Travis](https://api.travis-ci.org/gosquared/ipcheck.svg)](https://travis-ci.org/gosquared/ipcheck)
[![Dependencies](https://david-dm.org/gosquared/ipcheck.svg)](https://david-dm.org/gosquared/ipcheck)
[![Join the chat at https://gitter.im/gosquared/ipcheck](https://img.shields.io/badge/gitter-join%20chat-blue.svg)](https://gitter.im/gosquared/ipcheck)

[![NPM](https://nodei.co/npm/ipcheck.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/ipcheck)


Quickly parses IP addresses, allowing them to be checked for CIDR matches.

Converts IPv4 to IPv6 to keep the process seamless and allow transitional IPs.

## Install

`npm install ipcheck --save`

## Usage

### Quick

To easily check an IP and a CIDR without any extra thrills...

```js
var IPCheck = require('ipcheck');
IPCheck.match('192.168.0.1', '192.168.0.1/32'); //= true
```

### Ordinary

Allows you to individually validate and re-use different IPs.

```js
var IPCheck = require('ipcheck');
var ip = new IPCheck('192.168.0.1');
var cidr = new IPCheck('192.168.0.1/32');

ip.match(cidr); //= true
```

### IPv6

Works seamlessly!

```js
IPCheck.match('FE80:0000:0000:0000:0202:B3FF:FE1E:8329', 'FE80:0000:0000:0000:0202:B3FF:FE1E:8329/128'); //= true
```

#### IPv4 and IPv6 transitional

As all IPv4 addresses are converted to IPv6, transitional IPs are supported.

```js
var ip = new IPCheck('192.168.0.1');
var ipv4cidr = new IPCheck('192.168.0.1/32');
var ipv6cidr = new IPCheck('::ffff:192.168.0.1/128');
ip.match(ipv4cidr); //= true
ip.match(ipv6cidr); //= true
```

To convert a CIDR from IPv4 to IPv6, the mask simply has 96 added to it.

### Invalid IPs/errors

IPCheck is designed to not throw errors.

If you'd like to know an address is valid, simply read the `valid` property...

```js
var ip = new IPCheck('192.168.0.1');
ip.valid; //= true

var badIP = new IPCheck([ 'huh?' ]);
badIP.valid; //= false

var anotherBadIP = new IPCheck('silly.ip');
anotherBadIP.valid; //= false

// Match always returns false if either the IP or the CIDR are invalid
IPCheck.match('hi', 'oh/no');
```

## Other

### Benchmarks

`npm run benchmark` - simply compares this to ipaddr.js and ip-address modules in places. The TL;DR of it is that ipcheck is reliably faster.

### Tests

`npm test` - ensure everything works!
