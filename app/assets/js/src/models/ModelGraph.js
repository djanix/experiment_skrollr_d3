define([
	'src/models/Model',
	'vendor/d3/d3.min'
], function () {
	var className = 'ModelGraph';

	$[className] = new Class({
		jQuery: className,
		Extends: $.Model,
		options: {},

		//-- init
		//---------------------------------------------
		initialize: function (el, options) {
			el = $(el);
			var self = this;
			self.parent(el, options);
		},

		//-- Vars
		//--------------------------------------------------------------
		n: 20, // number of layers
		m: 200, // number of samples per layer

		stack: null,
		layers0: null,
		layers1: null,

		width: $(window).width(),
		height: 500,

		x: null,
		y: null,
		color: null,
		area: null,
		svg: null,

		busy: false,

		// Functions
		//----------------------------------------------------------------
		init: function() {
			var self = this;

			self.stack = d3.layout.stack().offset("wiggle");
			self.layers0 = self.stack(d3.range(self.n).map(function() { return self.bumpLayer(self.m); }));
			self.layers1 = self.stack(d3.range(self.n).map(function() { return self.bumpLayer(self.m); }));

			self.x = d3.scale.linear()
				.domain([0, self.m - 1])
				.range([0, self.width]);

			self.y = d3.scale.linear()
				.domain([0, d3.max(self.layers0.concat(self.layers1), function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
				.range([self.height, 0]);

			self.color = d3.scale.linear()
				.range(["#aad", "#556"]);

			self.area = d3.svg.area()
				.x(function(d) { return self.x(d.x); })
				.y0(function(d) { return self.y(d.y0); })
				.y1(function(d) { return self.y(d.y0 + d.y); });

			self.svg = d3.select("#page2").append("svg")
				.attr("width", self.width)
				.attr("height", self.height);

			self.svg.selectAll("path")
				.data(self.layers0)
				.enter().append("path")
				.attr("d", self.area)
				.style("fill", function() { return self.color(Math.random()); });
		},

		transition: function() {
			var self = this;
			if (self.busy) { return;}
			self.busy = true;

			d3.selectAll("path")
				.data(function() {
					var d = self.layers1;
					self.layers1 = self.layers0;
					self.layers0 = d;
					return self.layers0;
				})
				.transition()
				.duration(800)
				.attr("d", self.area)
				.each("end", function() {
					self.busy = false;
				});
		},

		// Inspired by Lee Byron's test data generator.
		bumpLayer: function(n) {
			var self = this;

			function bump(a) {
				var x = 1 / (0.1 + Math.random()),
					y = 2 * Math.random() - 0.5,
					z = 10 / (0.1 + Math.random());
				for (var i = 0; i < n; i++) {
					var w = (i / n - y) * z;
					a[i] += x * Math.exp(-w * w);
				}
			}

			var a = [], i;
			for (i = 0; i < n; ++i) a[i] = 0;
			for (i = 0; i < 5; ++i) bump(a);
			return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
		},

		empty: null
	});

	return $[className];
});