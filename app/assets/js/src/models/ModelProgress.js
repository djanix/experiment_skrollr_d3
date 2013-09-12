define([
	'src/models/Model',
	'vendor/d3/d3.min'
], function () {
	var className = 'ModelProgress';

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
		width: 960,
		height: 500,
		twoPi: 2 * Math.PI,
		progress: 0,
		total: 1308573, // must be hard-coded if server doesn't report Content-Length
		formatPercent: d3.format(".0%"),

		arc: null,
		svg: null,
		meter: null,
		foreground: null,
		text: null,

		// Functions
		//----------------------------------------------------------------
		init: function() {
			var self = this;

			self.arc = d3.svg.arc()
				.startAngle(0)
				.innerRadius(180)
				.outerRadius(240);

			self.svg = d3.select("#page4").append("svg")
				.attr("width", self.width)
				.attr("height", self.height)
				.append("g")
				.attr("transform", "translate(" + self.width / 2 + "," + self.height / 2 + ")");

			self.meter = self.svg.append("g")
				.attr("class", "progress-meter");

			self.meter.append("path")
				.attr("class", "background")
				.attr("d", self.arc.endAngle(self.twoPi));

			self.foreground = self.meter.append("path")
				.attr("class", "foreground");

			self.text = self.meter.append("text")
				.attr("text-anchor", "middle")
				.attr("dy", ".35em");
		},

		updateProgress: function(value) {
			var self = this;

			var i = d3.interpolate(self.progress, value);
			self.progress = value/100;
			d3.transition().tween("progress", function() {
				return function(t) {
					progress = i(t);
					self.foreground.attr("d", self.arc.endAngle(self.twoPi * self.progress)).style("opacity", self.progress);
					self.text.text(self.formatPercent(self.progress)).style("opacity", self.progress);
				};
			});
		},

		finishedProgress: function() {
			var self = this;
			self.meter.transition().delay(250).attr("transform", "scale(0)");
		},

		empty: null
	});

	return $[className];
});