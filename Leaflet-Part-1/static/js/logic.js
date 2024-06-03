
// Create map variable
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
  });

// Add streetmap tile layer to map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);


// define url for the chosen json endpoint
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'


// create popup function for geoJSON
function onEachFeature (feature,layer) {
    layer.bindPopup(`<h3> Location: ${feature.properties.place}</h3><hr>
                    <h3> Magnitude: ${feature.properties.mag}</h3>
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
    L.geoJSON(data, 
      {
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature
      }).addTo(myMap);


    // create a legend
    let legend = L.control({ position: 'bottomright' });

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

});