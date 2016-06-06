/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global window */

	function NodeParser(node) {

		var nodeContainer = this;

		nodeContainer.attr = {};

		nodeContainer.set(nodeContainer.KEYS.NODE, node);
		nodeContainer.set(nodeContainer.KEYS.PARSED_NODE, nodeContainer.parseNode(node));

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
				root.children.push(nodeInJson);
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

				if ( nodeContainer.hasTextNodeOnly(node) ) {
					text = node.childNodes[0].textContent.trim();
				}

				break;

			case nodeContainer.REFERENCE.NODE_TYPE[3]:

				text = node.textContent.trim();

				if (!text || nodeContainer.hasTextNodeOnly(node.parentNode)) {
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

	NodeParser.prototype.hasTextNodeOnly = function (node) {

		var nodeContainer = this;

		return node.childNodes.length === 1 && nodeContainer.REFERENCE.NODE_TYPE[node.childNodes[0].nodeType] === nodeContainer.REFERENCE.NODE_TYPE[3];

	};

	win.NodeParser = NodeParser;

}(window));