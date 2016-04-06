/**
 * onFunctions 1.0.6 javascript jQuery like on/of function
 * Author: Tóth András
 * Web: http://atandrastoth.co.uk
 * email: atandrastoth@gmail.com
 * Licensed under the MIT license
 */
/**
 * Description: Attach an event handler function for one or more events to the selected elements.
 * @param  {string} One or more comma separated event types                 [required]
 * @param  {string} css selector string to filter the descendants 
 *         of the selected elements that trigger the event. 
 *         If the selector is null or omitted, the event is always 
 *         triggered when it reaches the selected element.                  [optional]
 * @param  {function} A function to execute when the event is triggered.    [required]
 */
!NodeList.prototype.on ? NodeList.prototype.on = function(types, selectors, func) {
    (function(doc) {
        matches = doc.matchesSelector || doc.webkitMatchesSelector || doc.mozMatchesSelector || doc.oMatchesSelector || doc.msMatchesSelector;
    })(document.documentElement);
    types = types ? types.split(',').map(function(s) {
        return s.trim();
    }) : [];
    if (typeof selectors !== 'string') {
        func = selectors;
        selectors = [];
    } else {
        selectors = selectors.split(',').map(function(s) {
            return s.trim();
        });
    }

    function onFunction(sel, tp, fn) {
        this.selector = sel;
        this.type = tp;
        this.func = fn;
        this.addEvent = function(item) {
            item.addEventListener(this.type, this.func, false);
        };
        this.removeEvent = function(item) {
            item.removeEventListener(this.type, this.func, false);
        };
    }
    [].forEach.call(this, function(root) {
        if (!root.onFunctions) {
            root.onFunctions = [];
            if (selectors.length) {
                root.DOMNodeChanged = function(e) {
                    if (e.relatedNode.onFunctions && e.target.querySelectorAll) {
                        var nodes = [].slice.call(e.target.querySelectorAll('*'));
                        nodes.push(e.target);
                        nodes.forEach(function(node) {
                            e.relatedNode.onFunctions.filter(function(func) {
                                return matches.call(node, func.selector);
                            }).forEach(function(func) {
                                if (e.type == 'DOMNodeInserted') {
                                    func.addEvent(node);
                                } else {
                                    func.removeEvent(node);
                                }
                            });
                        });
                    }
                };
            }
            root.addEventListener('DOMNodeRemoved', root.DOMNodeChanged, false);
            root.addEventListener('DOMNodeInserted', root.DOMNodeChanged, false);
        }
        if (!selectors.length) {
            types.forEach(function(type) {
                var onFunc = new onFunction(null, type, func);
                onFunc.addEvent(root);
                root.onFunctions.push(onFunc);
            });
        } else {
            types.forEach(function(type) {
                selectors.forEach(function(selector) {
                    var onFunc = new onFunction(selector, type, func);
                    root.onFunctions.push(onFunc);
                    [].forEach.call(root.querySelectorAll(selector), function(el) {
                        onFunc.addEvent(el);
                    });
                });
            });
        }
    });
} : console.error('NodeList.prototype.on already defined!');
/**
 * Description: Remove an event handler.
 * @param  {string} One or more comma separated event types                 [optional]
 * @param  {string} A selector which should match the one originally 
 *         passed to .on() when attaching event handlers.                   [optional]
 */
!NodeList.prototype.off ? NodeList.prototype.off = function(types, selectors) {
    types = types ? types.split(',').map(function(s) {
        return s.trim();
    }) : [];
    var destroy = types.length ? false : true;
    selectors = selectors ? selectors.split(',').map(function(s) {
        return s.trim();
    }) : [];
    [].forEach.call(this, function(root) {
        if (root.onFunctions) {
            if (!selectors.length && !types.length) {
                root.removeEventListener('DOMNodeRemoved', root.DOMNodeChanged);
                root.removeEventListener('DOMNodeInserted', root.DOMNodeChanged);
            }
            root.onFunctions.filter(function(func) {
                return (types.indexOf(func.type) !== -1 || !types.length) && (selectors.indexOf(func.selector) !== -1 || !selectors.length);
            }).forEach(function(func) {
                if (func.selector === null) {
                    func.removeEvent(root);
                }
                [].forEach.call(root.querySelectorAll(func.selector), function(el) {
                    func.removeEvent(el);
                });
                root.onFunctions.splice(root.onFunctions.indexOf(func), 1);
                func = null;
            });
            if (destroy) {
                root.onFunctions = null;
                delete root.onFunctions;
                root.DOMContentChanged = null;
                delete root.DOMContentChanged;
            }
        }
    });
} : console.error('NodeList.prototype.off already defined!');
/**
 * Description: Attach an event handler function for one or more events to the selected elements.
 * @param  {string} One or more comma separated event types                 [required]
 * @param  {string} css selector string to filter the descendants 
 *         of the selected elements that trigger the event. 
 *         If the selector is null or omitted, the event is always 
 *         triggered when it reaches the selected element.                  [optional]
 * @param  {function} A function to execute when the event is triggered.    [required]
 */
!HTMLElement.prototype.on ? HTMLElement.prototype.on = function(types, selectors, func) {
    NodeList.prototype.on.call([this], types, selectors, func);
} : console.error('HTMLElement.prototype.on already defined!');
/**
 * Description: Remove an event handler.
 * @param  {string} One or more comma separated event types                 [optional]
 * @param  {string} A selector which should match the one originally 
 *         passed to .on() when attaching event handlers.                   [optional]
 */
!HTMLElement.prototype.off ? HTMLElement.prototype.off = function(types, selectors) {
    NodeList.prototype.off.call([this], types, selectors);
} : console.error('HTMLElement.prototype.off already defined!');