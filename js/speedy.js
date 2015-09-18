/**
 * Created by pieropanj on 03/09/2015.
 */

var SpeedyUtils = {
    // W3C practice to recognize an array
    isArray : function(array) {
        if (typeof array !== "undefined" && array != null)
            return array.constructor.toString().indexOf("Array") > -1;
        return false;
    },

    // Check if an object is not undefined, not null and not blank
    isNotNUB : function(obj) {
        return !(typeof obj === "undefined" || obj == null || obj.length === 0);
    },
};

var directiveBind;

directiveBind = {

    name: "sp-bind",

    init: function (speedy, key, element) {
        // Add event listener on input element
        if (element.tagName === "INPUT") {
            element.addEventListener("input", function (event) {
                speedy.setScopeValue(event.target.getAttribute(speedy.directive.name), event.target.value);
            });
        }
    },

    watcher: function (speedy, key, element) {
        var value = speedy.getScopeValue(key);
        if (value != null) {
            digester(speedy, value, element);
        }
    }

};

function digester(speedy, value, element) {
    var tmpNode = element.cloneNode(true);
    var selector = "[" + speedy.directive.name + "]";
    var elts = tmpNode.querySelectorAll(selector);
    var binding = false;
    for (var i = 0, j = elts.length; i < j; i++) {
        var elt = elts[i];
        binding = true;
        speedy.watcher(speedy, null, elt);
    }
    if (!binding) {
        simpleDigester(speedy, value, element);
    }
    return tmpNode.innerHTML;
}

function simpleDigester(speedy, value, element) {
    if (element.value) {
        element.value = value;
    } else if (typeof value === 'object' && value != null) {
        element.innerHTML = JSON.stringify(value);
    } else {
        element.innerHTML = value;
    }
}

function Speedy() {

    var self = this;

    // Global configuration
    self.conf = {
        version : 0.1,
        debug : true
    };

    // Logger
    self.logger = {

        info : function(text) {
            self.conf.debug && console.info("[Speedy Log] - [INFO] - " + text);
        },

        warning : function(text) {
            self.conf.debug && console.warn("[Speedy Log] - [WARNING] - " + text);
        },

        error : function(text) {
            self.conf.debug && console.error("[Speedy Log] - [ERROR] - " + text);
        }

    };

    // Global speedy scope
    self.scope = {};

    // Speedy's active directive
    self.directive = null;

    // Get selected elements from directive name and scope key
    // Return the list of dom nodes
    self.getSelectedElements = function(key) {
        var elements = null;
        var selector = "[" + self.directive.name;
        if (SpeedyUtils.isNotNUB(key))
            selector += "^='" + key + "'";
        selector += "]";

        if (typeof document !== "undefined") {
            var elements = document.querySelectorAll(selector);
        } else {
            self.logger.warning("getSelectedElements FAILED. document object doesn't exist !");
        }

        return elements;
    };

    // Initier function browse each focused element
    self.initier = function () {
        self.logger.info("Run initier ! Run !!");

        var elements = self.getSelectedElements(null);
        if (elements != null && elements.length !== 0) {
            var elementsLength = elements.length;
            while (elementsLength--) {
                var element = elements[elementsLength];
                var elementKey = element.getAttribute(self.directive.name);
                var scopeKey = self.getScopeRootKey(elementKey);
                if (scopeKey)
                {
                    self.createScopeValue(scopeKey);
                    self.directive.init(self, scopeKey, element);
                }
            }
        } else {
            self.logger.warning("initier FAILED. It seems that the html document doesn't contain selected dom node :(");
        }
    };

    // Create the scope value if and only if the root key doesnt exist
    // Keys should be something like : "test.test1"
    self.createScopeValue = function (keys) {
        var key = self.getScopeRootKey(keys);
        if (key != null && self.scope[key] === undefined) {
            self.logger.info("createScopeValue for key = '" + key + "'");
            self.scope[key] = null;
        }
    };

    // Get the root key of a specified scope key
    // Keys should something like : "test.test1.test2"
    self.getScopeRootKey = function (keys) {
        if (!SpeedyUtils.isNotNUB(keys)) {
            self.logger.warning("getScopeRootKey FAILED for key = " + keys);
            return null;
        }

        var keysArr = keys.split(".");
        var key = keysArr.length > 0 ? keysArr[0].trim() : null;
        key = key.length > 0 ? key : null;

        self.logger.info("getScopeRootKey for key = '" + keys + "'. Result = " + key);

        return key;
    };

    self.getScopeValue = function (keys) {

        console.warn("getScopeValue DEGUEU");

        if (typeof keys === "undefined" || keys == null || keys.length === 0)
            return null;

        var keysArr = keys.split(".");
        var i = 0, keysArrLength = keysArr.length;
        var tmp = null, result = null;
        while (i < keysArrLength) {
            var key = keysArr[i].trim();
            if (i === 0 && self.scope.hasOwnProperty(key)) {
                tmp = self.scope[key];
            } else if (i != 0 && tmp.hasOwnProperty(key)) {
                tmp = tmp[key];
            } else {
                tmp = null;
                break;
            }
            i++;
        }

        self.logger.info("getScopeValue for key = '" + keys + "'. Result = " + tmp);

        return tmp;
    };

    self.setScopeValue = function(keys, value) {

        console.warn("setScopeValue DEGUEU");

        if (typeof keys === "undefined" || keys == null || keys.length === 0)
            return null;

        self.logger.info("setScopeValue for key = '" + keys + "' and value = '" + value + "' (previous value : '" + self.getScopeValue(keys) + "')");

        var keysArr = keys.split(".");
        var i = 0, keysArrLength = keysArr.length;
        var tmp = self.scope, result = null;
        var key = keysArrLength == 1 ? keysArr[0].trim() : null;

        while (i < keysArrLength - 1) {
            key = keysArr[i].trim();
            if (i === 0 && self.scope.hasOwnProperty(key)) {
                tmp = self.scope[key];
            } else if (i != 0 && tmp.hasOwnProperty(key)) {
                tmp = tmp[key];
            } else {
                tmp = null;
                break;
            }
            i++;
        }

        if (tmp != null && i == keysArrLength - 1 && tmp.hasOwnProperty(keysArr[i].trim())) {
            tmp[keysArr[i].trim()] = value;
        } else if (tmp == null && i == keysArrLength - 1) {
            self.scope[keysArr[i].trim()] = value;
        }

        self.watcher(self.getScopeRootKey(keys));
    };

    self.watcher = function (key) {

        var elements = self.getSelectedElements(key);

        if (elements != null && elements.length !== 0) {
            var elementsLength = elements.length;
            while (elementsLength--) {
                var element = elements[elementsLength];
                self.directive.watcher(self, element.getAttribute(self.directive.name), element);
            }
        }
    };

    // Initiates speedy directives
    self.injectDirective = function(directive) {

        self.logger.info("injectDirective with name " + directive.name);

        var directiveTmp = {
            name : directive.name,
            init : function(scope, key, element){
                if (typeof directive.init === "function") {
                    return directive.init(scope, key, element);
                }
                return null;
            },
            watcher : function(scope, key, element){
                if (typeof directive.watcher === "function") {
                    return directive.watcher(scope, key, element);
                }
                return null;
            }
        };

        self.directive = directiveTmp;
    };

    self.simpleDigester = function(value, element) {
        if (element.value) {
            element.value = value;
        } else {
            element.innerHTML = value;
        }
    };

    self.digester = function(value, element) {
        var tmpNode = element.cloneNode(true);
        var elts = tmpNode.getElementsByTagName("*");
        var binding = false;
        for (var i = 0, j = elts.length; i < j; i++) {
            var elt = elts[i];
            for (var directiveName in self.directives) {
                if (self.directives.hasOwnProperty(directiveName)) {
                    var key = directiveName;
                    var directive = self.directives[directiveName];
                    if (elt.hasAttribute(key)) {
                        binding = true;
                        var tmp = value[elt.getAttribute(key)];
                        directive.digester(tmp, elt);
                    }
                }
            }
        }
        if (!binding) {
            self.simpleDigester(value, element);
        }
        return tmpNode.innerHTML;
    };

    // Initiates directives
    self.injectDirective(directiveBind);

    // Initiates speedy
    self.initier();

    if (typeof module !== "undefined")
        module.exports = self;

    return {
        setScopeValue : self.setScopeValue,
        getScopeValue : self.getScopeValue
    };
}

Speedy.prototype.getScopeNode = function(key) {
    var self = this;
    if (self.scope[key] === undefined) {
        new self.ScopeNode(key);
    }
    return self.scope[key];
};

var speedy = new Speedy();

speedy.setScopeValue("test", "89898989");
speedy.setScopeValue("name", "name42");
speedy.setScopeValue("list", {
    test1 : "test1value",
    test2 : {
        test3 : "test3value"
    }
});

function test() {
    var randomnumber=Math.floor(Math.random()*10);
    var test = [];
    for (var i = 0, j = randomnumber; i < j; i++) {
        test.push({
            value1 : i.toString(),
            value2 : "test" + i.toString()
        });
    }
    speedy.scope.list = test;

    var randomnumber=Math.floor(Math.random()*10);
    test = [];
    for (var i = 0, j = randomnumber; i < j; i++) {
        test.push({
            value1 : i.toString(),
            value2 : "test" + i.toString()
        });
    }
    speedy.scope.list2 = test;

    speedy.scope.name = Math.floor(Math.random()*10000);;

    speedy.scope.name2 = Math.floor(Math.random()*10000);;

    speedy.scope.test = Math.floor(Math.random()*10000);;
}
