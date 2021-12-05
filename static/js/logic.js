function createMap(earthquakes) {
    
    var satellite = 
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

    var outdoor = 
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
});
  
    var grayscale = 
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
    });

    var faultLines = new L.LayerGroup();

  // Create a baseMaps object to hold the outdoor, grayscale and satellite layer
    var baseMaps = {
        "Outdoors View": outdoor,
        "Grayscale View": grayscale,
        "Satellite View": satellite   
    };

    // Create an overlayMaps object to hold the earthquakes and fault lines layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        FaultLines: faultLines
      };

    // Create the map object with options
    var map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [satellite, earthquakes, faultLines]
      });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);
      
    //   Import raw file of faultline
    var faultlinequery = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

    // Create the faultlines and add them to the faultline layer
    d3.json(faultlinequery, function(data) {
        L.geoJSON(data, {
        style: function() {
            return {color: "red", fillOpacity: 0}
        }
        }).addTo(faultLines)

 
    })

}

// Data from USGS
var qurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json(qurl, function(data) {

    mapFeatures(data.features);

  function mapFeatures(data) {

    // Binding a pop-up to each layer
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    function radiusSize(magnitude) {
      return magnitude * 10000;
    }
  
    function getColor(magnitude) {
        switch (true) {
        case magnitude > 5:
          return "#92a8d1";
        case magnitude > 4:
          return "#deeaee";
        case magnitude > 3:
          return "#878f99";
        case magnitude > 2:
          return "#eecc00";
        case magnitude > 1:
          return "#b1cbbb";
        default:
          return "#ffef96";
        }
    }
  
    var earthquakes = L.geoJSON(data, {
      pointToLayer: function(data, latlng) {
        return L.circle(latlng, {
          radius: radiusSize(data.properties.mag),
          color: getColor(data.properties.mag),
          fillOpacity: 1,
          stroke: true
                    
        });
      },
      onEachFeature: onEachFeature
    });
   
    createMap(earthquakes);
  }


});
