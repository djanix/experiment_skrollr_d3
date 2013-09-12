define([
	'src/views/View',
	'src/models/Model',
	'src/models/ModelGraph',
	'src/models/ModelParticles',
	'src/models/ModelProgress',
	'vendor/skrollr/dist/skrollr.min'
], function () {
	var className = 'ViewHome';

	$[className] = new Class({
		jQuery: className,
		Extends: $.View,
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
		scrollPosition: 0,
		graph: null,
		particles: null,
		progress: null,

		//-- Init
		//--------------------------------------------------------------
		initHook: function () {
			var self = this;

			self.parent();
			self.bindEventsHook();

			var s = skrollr.init({
				smoothScrolling: true,
				forceHeight: false
			});

			self.graph = new $.ModelGraph();
			self.particles = new $.ModelParticles();
			self.progress = new $.ModelProgress();

			self.progress.updateProgress(20);
		},

		//-- Functions
		//--------------------------------------------------------------
		bindEventsHook: function () {
			var self = this;

			$(window).scroll(function () {
				self.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
				self.graph.transition();
				self.particles.updateParticles(self.scrollPosition);

				self.progress.updateProgress(self.calculatePercent(self.scrollPosition, 1600, 2000));

				var animNumber = self.runningAnim(self.scrollPosition, 30);
				if (animNumber) {
					$('.running_man span').removeClass().addClass('anim_' + animNumber);
				}
			});
		},

		calculatePercent: function(itemPos, min, max) {
			var divide = (max - min) / 100;

			if (itemPos < min) {
				return(0);
			} else if (itemPos > max) {
				return(100);
			} else {
				return((itemPos - min) / divide);
			}
		},

		runningAnim: function(scrollValue, animMaxVal) {
			if (scrollValue < 2600 || scrollValue > 3200) { return null; }
			var imageId = Math.ceil((scrollValue - 2600) / 10) % animMaxVal;
			return imageId;
		},

		empty: null
	});

	return $[className];
});