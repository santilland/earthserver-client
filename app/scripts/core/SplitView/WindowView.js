
define([
	'backbone.marionette',
	'hbs!tmpl/Window',
	'communicator'
],function(Marionette, WindowTmpl, Communicator) {

	'use strict';

	var WindowView = Marionette.Layout.extend({

		className: "windowview",

		template: {
			type: 'handlebars',
			template: WindowTmpl
		},

		regions: {
			viewport: '.viewport'
		},

		events: {
			'click .mapview-btn': function() {
				var options = {window:this, viewer:'MapViewer'};
				Communicator.mediator.trigger('window:view:change', options);

			},

			'click .globeview-btn': function() {
				var options = {window:this, viewer:'VirtualGlobeViewer'};
				Communicator.mediator.trigger('window:view:change', options);
			},

			'click .boxview-btn': function() {
			},

			'click .analyticsview-btn': function() {
			}
		},

		initialize: function() {
			//this.view = null;
		},

		showView: function(view) {
			this.viewport.show(view);
		}

	});

	return WindowView;
});