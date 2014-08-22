(function() {
	'use strict';

	var root = this;

	root.require([
		'backbone',
		'communicator',
    	'globals',
		'app'
	],

	function( Backbone, Communicator, globals, App) {

		var LayerController = Backbone.Marionette.Controller.extend({

		    initialize: function(options){
		        //this.listenTo(Communicator.mediator, "ui:open:layercontrol", this.onLayerControlOpen);
		        this.listenTo(Communicator.mediator, "layer:activate", this.layerActivate);
		        this.layercontrolopen = false;
			},

			/*onLayerControlOpen: function () {
		       this.layercontrolopen = !this.layercontrolopen;
		       if(this.layercontrolopen){
		       		this.stopListening(Communicator.mediator, "ui:open:layercontrol");
		       }else{
		       		this.listenTo(Communicator.mediator, "ui:open:layercontrol", this.onLayerControlOpen);
		       }
		    },*/

		   	layerActivate: function(layer){

		   		var tmp_layer = layer;

	            var layer = globals.products.find(function(model) { 
	            	if(model.get('views'))
	            		return model.get('views')[0].id == layer;
	            	else 
	            		return false; 
	            });

	            if(!layer) {
	            	layer = globals.overlays.find(function(model) { 
		            	if(model.get('view'))
		            		return model.get('view').id == tmp_layer;
		            	else 
		            		return false; 
		            });
	            }

	            var options = {};
	            if (layer) {
		        	if(layer.get('visible')){
		        		options = { name: layer.get('name'), isBaseLayer: false, visible: false };
		        		layer.set('visible',false);
		          	}else{
		            	options = { name: layer.get('name'), isBaseLayer: false, visible: true };
		            	layer.set('visible',true);
		          	}
		          	Communicator.mediator.trigger('map:layer:change', options);
	            }
			    
			}
		});
		return new LayerController();
	});

}).call( this );