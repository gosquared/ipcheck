var Benchmark = require('benchmark');
var IPCheck = require('../ipcheck');
var ipaddr = require('ipaddr.js');
var ipaddress = require('ip-address');

var suites = [];

var suite = new Benchmark.Suite('Unknown Parse (IPv4)');
suite.add('ipcheck', function() {
  new IPCheck('82.5.44.120');
});

suite.add('ipaddr.js', function() {
  try { ipaddr.parse('82.5.44.120'); } catch(e){};
});
suites.push(suite);



var suite = new Benchmark.Suite('Unknown Parse (IPv6)');
suite.add('ipcheck', function() {
  new IPCheck('FE80:0000:0000:0000:0202:B3FF:FE1E:8329');
});

suite.add('ipaddr.js', function() {
  try { ipaddr.parse('FE80:0000:0000:0000:0202:B3FF:FE1E:8329'); } catch(e){};
});
suites.push(suite);



var suite = new Benchmark.Suite('IPv4 Parse');
suite.add('ipcheck', function() {
  new IPCheck('82.5.44.120');
});

suite.add('ipaddr.js', function() {
  try { ipaddr.IPv4.parse('82.5.44.120'); } catch(e){};
});

suite.add('ip-address', function() {
  new ipaddress.v4.Address('82.5.44.120');
});
suites.push(suite);



var suite = new Benchmark.Suite('IPv6 Parse');
suite.add('ipcheck', function() {
  new IPCheck('FE80:0000:0000:0000:0202:B3FF:FE1E:8329');
});

suite.add('ipaddr.js', function() {
  try { ipaddr.IPv6.parse('FE80:0000:0000:0000:0202:B3FF:FE1E:8329'); } catch(e){};
});

suite.add('ip-address', function() {
  new ipaddress.v6.Address('FE80:0000:0000:0000:0202:B3FF:FE1E:8329');
});
suites.push(suite);



var suite = new Benchmark.Suite('Invalid IP');
suite.add('ipcheck', function() {
  new IPCheck('lol.this.is:silly');
});

suite.add('ipaddr.js', function() {
  try { ipaddr.parse('lol.this.is:silly'); } catch(e){};
});
suites.push(suite);



var suite = new Benchmark.Suite('CIDR');
suite.add('ipcheck ipv4', function() {
  new IPCheck('82.5.44.120/32');
});

suite.add('ipaddr.js ipv4', function() {
  try {
    ipaddr.IPv4.parseCIDR('82.5.44.120/32');
  } catch(e){};
});

suite.add('ipaddr.js ipv4 unknown', function() {
  try {
    ipaddr.parseCIDR('82.5.44.120/32');
  } catch(e){};
});

suite.add('ip-address ipv4', function() {
  new ipaddress.v4.Address('82.5.44.120/32');
});

suite.add('ipcheck ipv6', function() {
  new IPCheck('FE80:0000:0000:0000:0202:B3FF:FE1E:8329/110');
});

suite.add('ipaddr.js ipv6', function() {
  try {
    ipaddr.IPv6.parseCIDR('FE80:0000:0000:0000:0202:B3FF:FE1E:8329/110');
  } catch(e){};
});

suite.add('ipaddr.js ipv6 unknown', function() {
  try {
    ipaddr.parseCIDR('FE80:0000:0000:0000:0202:B3FF:FE1E:8329/110');
  } catch(e){};
});

suite.add('ip-address ipv6', function() {
  new ipaddress.v6.Address('FE80:0000:0000:0000:0202:B3FF:FE1E:8329/110');
});

suites.push(suite);



var suite = new Benchmark.Suite('Invalid CIDR');
suite.add('ipcheck ipv4', function() {
  new IPCheck('82.5.44:120/32');
});

suite.add('ipaddr.js ipv4', function() {
  try {
    ipaddr.IPv4.parseCIDR('82.5.44:120/32');
  } catch(e){};
});

suite.add('ipaddr.js ipv4 unknown', function() {
  try {
    ipaddr.parseCIDR('82.5.44:120/32');
  } catch(e){};
});

suite.add('ipcheck ipv6', function() {
  new IPCheck('FE80:0000:0000:0000:0202:B3FF:FE1E.8329/110');
});

suite.add('ipaddr.js ipv6', function() {
  try {
    ipaddr.IPv6.parseCIDR('FE80:0000:0000:0000:0202:B3FF:FE1E.8329/110');
  } catch(e){};
});

suite.add('ipaddr.js ipv6 unknown', function() {
  try {
    ipaddr.parseCIDR('FE80:0000:0000:0000:0202:B3FF:FE1E.8329/110');
  } catch(e){};
});

suites.push(suite);



var suite = new Benchmark.Suite('Match');
suite.add('ipcheck ipv4', function() {
  var ip = new IPCheck('82.5.44.120');
  var cidr = new IPCheck('82.5.44.120/32');
  ip.match(cidr);
});

suite.add('ipaddr.js ipv4', function() {
  try {
    var ip = ipaddr.IPv4.parse('82.5.44.120');
    var cidr = ipaddr.IPv4.parseCIDR('82.5.44.120/32');
    ip.match(cidr);
  } catch(e){};
});
suite.add('ipcheck ipv6', function() {
  var ip = new IPCheck('FE80:0000:0000:0000:0202:B3FF:FE1E:8329');
  var cidr = new IPCheck('FE80:0000:0000:0000:0202:B3FF:FE1E:8329/128');
  ip.match(cidr);
});

suite.add('ipaddr.js ipv6', function() {
  try {
    var ip = ipaddr.IPv6.parse('FE80:0000:0000:0000:0202:B3FF:FE1E:8329');
    var cidr = ipaddr.IPv6.parseCIDR('FE80:0000:0000:0000:0202:B3FF:FE1E:8329/128');
    ip.match(cidr);
  } catch(e){};
});

suites.push(suite);



suites.forEach(function(suite) {
  console.log('Running ' + suite.name);
  suite
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').pluck('name') + '\n');
    });

  suite.run();
});
