

var directiveRepeat;

directiveRepeat = {

    name: "sp-repeat",

    init: null,

    watcher: function (scope, domNode, element, digester) {
        var tmpElt = element.current.cloneNode(true);
        var parent = element.parent;

        while (parent != null && parent.hasChildNodes()) {
            parent.removeChild(parent.firstChild);
        }

        var beforeElt;
        for (var i = 0, j = domNode.value.length; i < j; i++) {
            if (i === 0) {
                tmpElt.setAttribute("sp-repeat-start", "");
                tmpElt.removeAttribute("sp-repeat-end");
                tmpElt.innerHTML = digester(domNode.value[i], element.current);
                parent.appendChild(tmpElt);
            } else {
                tmpElt = tmpElt.cloneNode(true);
                tmpElt.removeAttribute("sp-repeat-start");
                tmpElt.removeAttribute("sp-repeat-end");
                tmpElt.innerHTML = digester(domNode.value[i], element.current);
                parent.insertBefore(tmpElt, beforeElt.nextSibling);
            }
            if (i + 1 === j) {
                tmpElt.setAttribute("sp-repeat-end", "");
            }
            beforeElt = tmpElt;
        }

        if (typeof parent !== "undefined" && parent.hasChildNodes()) {
            return parent.firstChild;
        }

        return tmpElt;
    },

    digester: function (value, element) {

    }

};