

var directiveData;

directiveData = {

    name: "sp-data",

    init: function (scope, domNode, element) {
        element.current.addEventListener("input", function (event) {
            scope[domNode.key] = event.target.value;
        });
    },

    watcher: function (scope, domNode, element, digester) {
        digester(domNode.value, element.current);
        return element.current;
    },

    digester: null


};