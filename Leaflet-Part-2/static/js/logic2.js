
 // Add street map tile layer
 let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add satellite map tile layer
let satellite = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Add topographic tile layer
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


// Create a baseMaps object to hold the layers
let baseMaps = {
  "Satellite Map": satellite,
  "Street Map": street,
  "Topographical Map": topo
};


// Create map variable
var myMap = L.map("map", {
  center: [37.09, -95.71],
  layers: [satellite], 
  zoom: 3,
});

// Define arrays to hold the created data for tectonic plates and earthquakes
let earthquakeMarkers = [];
let plateMarkers = [];


//extract data from tectonic plate json file:
fetch('PB2002_plates.json')
    .then(response => response.json())
    .then(data => {
        plateMarkers.push(
        L.geoJSON(data,{
          style: function (feature){
            return {
              fillOpacity: 0,
              color: 'orange',
              weight: 1.5
              
            }
          }
        }))
      });

// define url for earthquake data in the last 7 days
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'


// create popup function for geoJSON
function onEachFeature (feature,layer) {
    layer.bindPopup(`<h3> Location: ${feature.properties.place}</h3><hr>
                    <h3> Magnitude: ${feature.properties.mag}</h3>
                    <hr><h3>Earthquake Depth: ${feature.geometry.coordinates[2]} km</h3>
                    <hr><p>${new Date(feature.properties.time)}</p>`)}


 // create circle marker function for geoJSON                  
 function pointToLayer(feature, latlng) {

    let thresholds = [10, 30, 50, 70, 90];
    let colors = ['lime', 'yellow', 'orange', 'coral', 'red', 'darkred'];
    let depth = feature.geometry.coordinates[2];
    let colorScale = d3.scaleThreshold().domain(thresholds).range(colors)
    let color = colorScale(depth)

    return L.circleMarker(latlng,{
        color: 'black',
        weight: .5,
        fillColor: color,
        fillOpacity: 8,
        radius: (feature.properties.mag) * 3
    });
};

// extract data using d3
d3.json(url).then(function (data) {

    //console.log(data)

    // Find depth min for the legend below
    depths = [];
    let features = data.features;
    for (let i = 0; i < features.length; i++) {
        let feature = features[i]
        depths.push(feature.geometry.coordinates[2])
    };

    let minDepth = Math.min(...depths)

    // map the geoJSONdata
    earthquakeMarkers.push(
    L.geoJSON(data, 
      {
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature
      }).addTo(myMap))

       // Create two separate layer groups: one for the tectonic plates and earthquakes
       let earthquakes = L.layerGroup(earthquakeMarkers);
       let plates = L.layerGroup(plateMarkers);
   
       let overlayMaps = {
         "Earthquakes": earthquakes,
         "Tectonic Plates": plates
       };
   

       // create a legend
      let legend = L.control({position: 'bottomright'});

      legend.onAdd = function () {

          let thresholds = [Math.round(minDepth,2), 10, 30, 50, 70, 90];
          let colors = ['lime', 'yellow', 'orange', 'coral', 'red', 'darkred'];

          let div = L.DomUtil.create('div', 'info legend');
          let labels = ['<strong> Earthquake Depth (km) </strong>'];

          for (let i = 0; i < thresholds.length; i++) {
              let from = thresholds[i];
              let to = thresholds[i + 1];
              labels.push(
                  '<li class="legend-item" style="background:' + colors[i] + '"></li> ' +
                  from + (to ? '&ndash;' + to : '+'));
      
          }
          div.innerHTML = labels.join('<br>');
          return div;
      };

       // Add legend to the map
      legend.addTo(myMap);
  
      // add layer controls to the map
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

});


