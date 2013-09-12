define([
	'src/models/Model',
	'vendor/d3/d3.min'
], function () {
	var className = 'ModelParticles';

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
		particleCount: 20,
		w: $(window).width(),
		h: $(window).height(),
		z: d3.scale.category20c(),
		i: 0,
		svg: null,

		// Functions
		//----------------------------------------------------------------
		init: function() {
			var self = this;
			self.svg = d3.select("#page3").append("svg:svg")
				.attr("width", self.w)
				.attr("height", self.h);

			for (var i=0;i<self.particleCount;i++) {
				self.particle();
			}
		},

		particle: function() {
			var self = this;

			self.svg.append("svg:circle")
				.attr("cx", Math.floor(Math.random() * self.w))
				.attr("cy", Math.floor(Math.random() * self.h))
				.attr("r", 1e-6)
				.style("stroke", self.z(++self.i));
		},

		updateParticles: function(pos) {
			var r = pos / 25;
			d3.selectAll("circle")
				.transition()
				.duration(50)
				.attr("r", r);
		},

		empty: null
	});

	return $[className];
});