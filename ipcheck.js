var net = require('net');
var ipaddr = require('ipaddr.js');

var IPCheck = module.exports = function(input) {
  var self = this;

  if(!(self instanceof IPCheck)){
    return new IPCheck(input);
  }

  self.input = input;
  self.parse();
};

IPCheck.prototype.parse = function() {
  var self = this;

  if (!self.input || typeof self.input !== 'string') return self.valid = false;

  var pos = self.input.lastIndexOf('/');
  if (pos !== -1) {
    self.ip = self.input.substring(0, pos);
    self.mask = +self.input.substring(pos + 1);
  } else {
    self.ip = self.input;
    self.mask = null;
  }

  self.ipv = net.isIP(self.ip);
  self.valid = !!self.ipv && !isNaN(self.mask);

  if (!self.valid) return;

  // default mask = 32 for ipv4 and 128 for ipv6
  self.mask = self.mask || (self.ipv === 4 ? 32 : 128);

  if (self.ipv === 4) {
    self.ip = '::ffff:' + self.ip;
    // difference between ipv4 and ipv6 masks
    self.mask += 96;
  }

  self.parsed = ipaddr.IPv6.parse(self.ip);

};

IPCheck.prototype.match = function(cidr) {
  var self = this;

  if (!(cidr instanceof IPCheck)) cidr = new IPCheck(cidr);
  if (!self.valid || !cidr.valid || !cidr.mask) return false;

  return self.parsed.match(cidr.parsed, cidr.mask);
};


IPCheck.match = function(ip, cidr) {
  ip = ip instanceof IPCheck ? ip : new IPCheck(ip);
  return ip.match(cidr);
};
