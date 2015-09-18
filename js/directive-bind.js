
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
