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

    it('should correctly parse addresses', function(){

      function check(str, expected) {
        assert.deepEqual(IPCheck(str).address, expected);
      }

      check('::', [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
      check('::1', [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ]);
      check('0:ffff::', [ 0, 0, 0xff, 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
      check('ffff::ffff', [ 0xff, 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff ]);
      check('1234:5678:9abc:def0:0fed:cba9:8765:4321', [ 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0, 0x0f, 0xed, 0xcb, 0xa9, 0x87, 0x65, 0x43, 0x21 ]);

      check('0.0.0.0', [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff, 0, 0, 0, 0 ]);
      check('123.234.123.234', [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff, 123, 234, 123, 234 ]);

      check('::ffff:1.2.3.4', [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff, 1, 2, 3, 4 ]);
    });

    it('should parse CIDR notation', function() {
      assert.strictEqual(IPCheck('192.168.0.0/32').mask, 32 + 96);
      assert.strictEqual(IPCheck('FE80:0000:0000:0000:0202:B3FF:FE1E:8329/110').mask, 110);
    });

    it('should default to correct masks', function() {
      assert.strictEqual(IPCheck('192.168.0.0').mask, 32 + 96);
      assert.strictEqual(IPCheck('FE80:0000:0000:0000:0202:B3FF:FE1E:8329').mask, 128);
    });

    it('shouldn\'t allow non-numeric masks', function() {
      assert.strictEqual(IPCheck('192.168.0.0/x').valid, false);
      assert.strictEqual(IPCheck('::1/true').valid, false);
    });
  });

  describe('#match()', function() {
    it('should validate an IP within a CIDR block', function() {
      assert.strictEqual(IPCheck('82.5.44.120').match(IPCheck('82.5.44.120/32')), true);
      assert.strictEqual(IPCheck('82.5.44.0').match(IPCheck('82.5.44.120/24')), true);
      assert.strictEqual(IPCheck('82.5.44.255').match(IPCheck('82.5.44.120/24')), true);
      assert.strictEqual(IPCheck('192.168.0.1').match(IPCheck('0.0.0.0/0')), true);
      assert.strictEqual(IPCheck('1234:5678:9abc:def0:0fed:cba9:8765:4321').match(IPCheck('0::0/0')), true);
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
});
