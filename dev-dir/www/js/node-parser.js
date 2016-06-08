/*jslint white: true, nomen: true */
(function () {

	'use strict';

	function NodeParser(node) {

		var nodeContainer = this;

		// detect if new NodeParser(node)
		if (nodeContainer) {
			nodeContainer.attr = {};
			nodeContainer.set(nodeContainer.KEYS.NODE, node);
			nodeContainer.set(nodeContainer.KEYS.PARSED_NODE, nodeContainer.parseNode(node));
		} else {
			// detect if NodeParser(node)
			return NodeParser.prototype.parseNode(node);
		}

	}

	NodeParser.prototype.KEYS = {
		NODE: 'node',
		PARSED_NODE: 'parsed-node'
	};

	NodeParser.prototype.REFERENCE = {
		// http://www.w3schools.com/jsref/prop_node_nodetype.asp
		NODE_TYPE: {
			'1': 'element',
			'3': 'text'
		}
	};

	NodeParser.prototype.set = function (key, value) {
		this.attr[key] = value;
	};

	NodeParser.prototype.get = function (key) {
		return this.attr[key];
	};

	NodeParser.prototype.getParsedNode = function () {

		var nodeContainer = this;

		return nodeContainer.get(nodeContainer.KEYS.PARSED_NODE);

	};

	NodeParser.prototype.parseNode = function (node) {

		var nodeContainer = this,
			childNodes = node.childNodes,
			childNode,
			nodeInJson,
			root = nodeContainer.nodeToJSON(node),
			i, len;

		if (!root) {
			return null;
		}

		for (i = 0, len = childNodes.length; i < len; i += 1) {
			childNode = childNodes[i];
			nodeInJson = nodeContainer.parseNode(childNode);
			if (nodeInJson) {
				root.children[root.children.length] = nodeInJson;
			}
		}

		return root;

	};

	NodeParser.prototype.nodeToJSON = function (node) {

		var nodeContainer = this,
			tagName = node.tagName || '',
			nodeType = nodeContainer.REFERENCE.NODE_TYPE[node.nodeType],
			attributes = {},
			nodeAttributes = node.attributes,
			nodeAttribute,
			text,
			i, len;

		switch (nodeType) {

			case nodeContainer.REFERENCE.NODE_TYPE[1]:

				tagName = tagName.toLowerCase();

				for (i = 0, len = nodeAttributes.length; i < len; i += 1) {
					nodeAttribute = nodeAttributes[i];
					attributes[nodeAttribute.name] = nodeAttribute.value;
				}

				break;

			case nodeContainer.REFERENCE.NODE_TYPE[3]:

				text = node.textContent;

				// --- WARNING ---
				// --- here is return ---
				if (!text.trim()) {
					return null;
				}

				break;

			default:

				console.log(' --- WAT? I do NOT know this type! --- ');

				break;

		}

		return {
			children: [],
			text: text,
			tagName: tagName,
			nodeType: nodeType,
			attributes: attributes
		};

	};

	var _globals = (function(){ return this || (0,eval)('this'); }());

	if (typeof module !== "undefined" && module.exports) {
		module.exports = NodeParser;
	} else if (typeof define === "function" && define.amd) {
		define(function(){return NodeParser;});
	} else {
		_globals.NodeParser = NodeParser;
	}

}());