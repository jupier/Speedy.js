var assert = require('assert');
var speedy = require('../js/speedy.js');

describe("Speedy", function(){

    before(function(){
        speedy.conf.debug = false;
    });

    describe("scope", function(){

        before(function(){
        });

        it('should return the scope root key', function() {
            assert.equal("root", speedy.getScopeRootKey("root.test.test2.test3"));
            assert.equal(null, speedy.getScopeRootKey(""));
            assert.equal(null, speedy.getScopeRootKey("              "));
            assert.equal(null, speedy.getScopeRootKey(null));
            assert.equal("root", speedy.getScopeRootKey("root...."));
            assert.equal(null, speedy.getScopeRootKey("..root.."));
            assert.equal("root", speedy.getScopeRootKey("root.   .   test2.  test3"));
        });
    });

});