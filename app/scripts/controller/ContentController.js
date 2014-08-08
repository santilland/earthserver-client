(function() {
	'use strict';

	var root = this;

	root.require([
		'backbone',
		'communicator',
		'app'
	],

	function( Backbone, Communicator, App ) {

		var ContentController = Backbone.Marionette.Controller.extend({
            initialize: function(options){
            	this.listenTo(Communicator.mediator, "ui:open:storybanner", this.StoryBannerOpen);
            	this.listenTo(Communicator.mediator, "ui:open:layercontrol", this.onLayerControlOpen);
            	this.listenTo(Communicator.mediator, "ui:open:toolselection", this.onToolSelectionOpen);
				this.listenTo(Communicator.mediator, "ui:open:options", this.onOptionsOpen);
				this.listenTo(Communicator.mediator, "ui:open:storybanner", this.StoryBannerOpen);
				this.listenTo(Communicator.mediator, "ui:open:legend", this.onOpenLegend);
				this.listenTo(Communicator.mediator, "ui:open:help", this.onOpenHelp);
				this.listenTo(Communicator.mediator, "dialog:open:about", this.onDialogOpenAbout);
				
			},

			onDialogOpenAbout: function(event){
				App.dialogRegion.show(App.DialogContentView);
			},

			onOpenLegend:function(event){
				App.dialogRegion.show(App.LegendContentView);
			},

			onOpenHelp: function(event){
				App.dialogRegion.show(App.HelpContentView);
			},
			
			onLayerControlOpen: function(event){
				//We have to render the layout before we can
                //call show() on the layout's regions
                if (_.isUndefined(App.layout.isClosed) || App.layout.isClosed) {
				  	App.leftSideBar.show(App.layout);
	                App.layout.baseLayers.show(App.baseLayerView);
	                App.layout.products.show(App.productsView);
	                App.layout.overlays.show(App.overlaysView);
				} else {
					App.layout.close();
                }
               
			},
			onToolSelectionOpen: function(event){
				if (_.isUndefined(App.toolLayout.isClosed) || App.toolLayout.isClosed) {
					App.rightSideBar.show(App.toolLayout);
					App.toolLayout.selection.show(App.selectionToolsView);
					App.toolLayout.visualization.show(App.visualizationToolsView);
					App.toolLayout.mapmode.show(App.visualizationModesView);
				} else {
					App.toolLayout.close();
				}
			},
			onOptionsOpen: function(event){
				if (_.isUndefined(App.optionsLayout.isClosed) || App.optionsLayout.isClosed) {
					App.optionsBar.show(App.optionsLayout);
					App.optionsLayout.colorramp.show(App.colorRampView);
				} else {
					App.optionsLayout.close();
				}
			},

			StoryBannerOpen: function(event){
				if(App.storyBanner){
					//$( "body" ).append( "<div id="storyView"></div>" );
					if (_.isUndefined(App.storyView.isClosed) || App.storyView.isClosed) {
						App.storyView.show(App.storyBanner);
					} else {
						App.storyView.close();
					}
				}
			}
		});
		return new ContentController();
	});

}).call( this );