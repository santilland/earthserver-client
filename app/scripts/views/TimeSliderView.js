(function() {
  'use strict';
  var root = this;
  root.define([
    'backbone',
    'communicator',
    'timeslider',
    'timeslider_plugins',
    'globals',
    'underscore',
    'd3'
  ],
  function( Backbone, Communicator, timeslider, timeslider_plugins, globals) {
    var TimeSliderView = Backbone.Marionette.ItemView.extend({
      id: 'timeslider',
      events: {
        'selectionChanged': 'onChangeTime',
        'coverageselected': 'onCoverageSelected'
      },
      initialize: function(options){
        this.options = options;
      },

      render: function(options){

      },
      onShow: function(view) {

        this.listenTo(Communicator.mediator, "map:layer:change", this.changeLayer);
        this.listenTo(Communicator.mediator, "map:position:change", this.updateExtent);
        this.listenTo(Communicator.mediator, "date:selection:change", this.onDateSelectionChange);

        Communicator.reqres.setHandler('get:time', this.returnTime);


        var selectionstart = new Date(this.options.brush.start);
        var selectionend = new Date(this.options.brush.end);

        this.activeWPSproducts = [];

        this.slider = new TimeSlider(this.el, {

          domain: {
            start: new Date(this.options.domain.start),
            end: new Date(this.options.domain.end)
          },
          brush: {
            start: selectionstart,
            end: selectionend
          },
          debounce: 300,
          ticksize: 8,

          datasets: []

        });

        Communicator.mediator.trigger('time:change', {start:selectionstart, end:selectionend});

        // For viewers that are loaded after the TimeSlider announces its initial timespan there
        // has to be a way to get the timespan for their setup. This is a 'sloppy' way of 
        // accomplishing this:
        Communicator.mediator.timeOfInterest = {
          start: selectionstart,
          end: selectionend
        };
      }, 

      onChangeTime: function(evt){
        Communicator.mediator.trigger('time:change', evt.originalEvent.detail);
        // Update ToI in the global context:
        Communicator.mediator.timeOfInterest = {
          start: evt.originalEvent.detail.start,
          end: evt.originalEvent.detail.end
        };
      },

      onDateSelectionChange: function(opt) {
        this.slider.select(opt.start, opt.end);
      },

      changeLayer: function (options) {
        if (!options.isBaseLayer){
          var product = globals.products.find(function(model) { return model.get('name') == options.name; });
          if (product){
            if(options.visible && product.get('timeSlider')){

              switch (product.get("timeSliderProtocol")){
                case "WMS":
                  this.slider.addDataset({
                    id: product.get('view').id.replace(/\W+/g,""),
                    color: product.get('color'),
                    data: new TimeSlider.Plugin.WMS({
                      url: product.get('view').urls[0],
                      eoid: product.get('view').id,
                      dataset: product.get('view').id.replace(/\W+/g,"")
                    })
                  });
                  break;
                case "EOWCS":
                  this.slider.addDataset({
                    id: product.get('download').id.replace(/\W+/g,""),
                    color: product.get('color'),
                    data: new TimeSlider.Plugin.EOWCS({
                        url: product.get('download').url,
                        eoid: product.get('download').id,
                        dataset: product.get('download').id.replace(/\W+/g,"")
                     })
                  });
                  break;
                case "WPS":
                  var extent = Communicator.reqres.request('map:get:extent');
                  this.slider.addDataset({
                    id: product.get('download').id.replace(/\W+/g,""),
                    color: product.get('color'),
                    data: new TimeSlider.Plugin.WPS({
                        url: product.get('download').url,
                        eoid: product.get('download').id,
                        dataset: product.get('download').id.replace(/\W+/g,"") ,
                        bbox: [extent.left, extent.bottom, extent.right, extent.top]
                     })
                  });
                  this.activeWPSproducts.push(product.get('download').id);
                  // For some reason updateBBox is needed, altough bbox it is initialized already.
                  // Withouth this update the first time activating a layer after the first map move
                  // the bbox doesnt seem to be defined in the timeslider library and the points shown are wrong
                  this.slider.updateBBox([extent.left, extent.bottom, extent.right, extent.top], product.get('download').id);
                  break;
              }
              
            }else{
              this.slider.removeDataset(product.get('download').id);
              if (this.activeWPSproducts.indexOf(product.get('download').id)!=-1)
                this.activeWPSproducts.splice(this.activeWPSproducts.indexOf(product.get('download').id), 1);
              console.log(this.activeWPSproducts);
            }
          }
        }
      },

      returnTime: function(){
        return Communicator.mediator.timeOfInterest;
      },

      updateExtent: function(extent){
        
        for (var i=0; i<this.activeWPSproducts.length; i++){
          console.log(this.activeWPSproducts[i]);
          this.slider.updateBBox([extent.left, extent.bottom, extent.right, extent.top], this.activeWPSproducts[i]);
        }
      },

      onCoverageSelected: function(evt){
        if (evt.originalEvent.detail.bbox){
          var bbox = evt.originalEvent.detail.bbox.replace(/[()]/g,'').split(',').map(parseFloat);
          this.slider.select(evt.originalEvent.detail.start, evt.originalEvent.detail.end);
          Communicator.mediator.trigger("map:set:extent", bbox);
        }
      }

      //

    });
    return {'TimeSliderView':TimeSliderView};
  });
}).call( this );