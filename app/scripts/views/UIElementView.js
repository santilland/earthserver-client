(function() {
	'use strict';

	var root = this;

	root.define([
		'backbone',
		'communicator',
		'hbs!tmpl/UIElement',
		'underscore'
	],

	function( Backbone, Communicator, UIElementTmpl ) {

		var UIElementView = Backbone.Marionette.ItemView.extend({

			initialize: function(options) {
				this.isclosed = true;
			},

			onShow: function(view){

				this.isclosed = false;

				this.$('.close').on("click", _.bind(this.onClose, this));
		        this.$el.draggable({ 
		          containment: "#content",
		          scroll: false,
		          handle: '.panel-heading'
		        });
				
			},

			onClose: function() {
				this.isclosed = true;
		        this.close();
		    },

		    isClosed: function(){
		    	return this.isclosed;
		    }



		});

		return {'UIElementView':UIElementView};

	});

}).call( this );