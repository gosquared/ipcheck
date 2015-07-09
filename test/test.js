var IPCheck = require('../ipcheck');
var assert = require('assert');

describe('IPCheck', function() {
  describe('new', function() {
    it('should work with or without "new" keyword', function() {
      assert.strictEqual(new IPCheck('192.168.0.0').valid, IPCheck('192.168.0.0').valid);
    });
  })
  describe('#parse()', function() {
    it('shouldn\'t validate non-strings', function() {
      var things = [
        true, false, null, {}, [], 3, undefined, console.log, Math
      ];
      for (var i = 0; i < things.length; i++) {
        assert.strictEqual(IPCheck(things[i]).valid, false);
      }
    });

    it('shouldn\'t validate bad IPs', function() {
      var ips = [
        '192:168:1:10',
        '256.0.0.0',
        'XE80:0000:0000:0000:0202:B3FF:FE1E:8329',
        '192168110',
        '192.168.0.-1'
      ];

      for (var i = 0; i < ips.length; i++) {
        assert.strictEqual(IPCheck(ips[i]).valid, false);
      }
    });

    it('should treat everything as IPv6 in ipaddr.js', function() {
      assert.strictEqual(IPCheck('192.168.0.0').address.length, 16);
      assert.strictEqual(IPCheck('FE80:0000:0000:0000:0202:B3FF:FE1E:8329').address.length, 16);
    });

    it('should parse CIDR notation', function() {
      assert.strictEqual(IPCheck('192.168.0.0/32').mask, 32 + 96);
      assert.strictEqual(IPCheck('FE80:0000:0000:0000:0202:B3FF:FE1E:8329/110').mask, 110);
    });

    it('should default to correct masks', function() {
      assert.strictEqual(IPCheck('192.168.0.0').mask, 32 + 96);
      assert.strictEqual(IPCheck('FE80:0000:0000:0000:0202:B3FF:FE1E:8329').mask, 128);
    });
  });

  describe('#match()', function() {
    it('should validate an IP within a CIDR block', function() {
      assert.strictEqual(IPCheck('82.5.44.120').match(IPCheck('82.5.44.120/32')), true);
      assert.strictEqual(IPCheck('82.5.44.0').match(IPCheck('82.5.44.120/24')), true);
      assert.strictEqual(IPCheck('82.5.44.255').match(IPCheck('82.5.44.120/24')), true);
    });

    it('shouldn\'t validate an IP outside a CIDR block', function() {
      assert.strictEqual(IPCheck('82.5.44.121').match(IPCheck('82.5.44.120/32')), false);
      assert.strictEqual(IPCheck('82.5.43.255').match(IPCheck('82.5.44.120/24')), false);
      assert.strictEqual(IPCheck('82.5.45.0').match(IPCheck('82.5.44.120/24')), false);
    });

    it('should accept a string as the CIDR block', function() {
      assert.strictEqual(IPCheck('82.5.44.120').match('82.5.44.120/32'), true);
    });

    it('should return false for invalid inputs', function() {
      assert.strictEqual(IPCheck('82.5.44.120').match('82.5.44:120/32'), false);
      assert.strictEqual(IPCheck('82.5.44:120').match('82.5.44.120/32'), false);
      assert.strictEqual(IPCheck('82.5.44.120').match('82.5.44.120/32x'), false);
    });

    it('should work as IPCheck method', function() {
      assert.strictEqual(IPCheck.match('82.5.44.120', '82.5.44.120/32'), true);
    });

  });
})
