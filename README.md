Module 15

This repository contains two interactive visualizations of all earthquake data from the last 7 days. The data is pulled from the United States Geological Survey and visualized through the Leaflet library. The first visualization in the Leaflet-Part-1 Folder contains the html, javascript and css files for the webpage. Each earthquake marker is varied to visually represent different characteristics of the earthquake, where the marker size is dependent on the magnitude and the marker color is dependent on the depth of the earthquake. The markers also contain popups to show more information about the earthquake. In Leaflet-Part-2 the visualization is the same, but now different map layers are added as well as the possibility to add a representation of earths tectonic plates 



Chat gpt was referenced to change the color of the marker through intervals of earthquake depth:


  let colorScale = d3.scaleThreshold().domain(thresholds).range(colors)
  let color = colorScale(depth)

As well as the css code to make the legend have a white box around it:

        .info.legend {
    background-color: white;
    padding: 10px;
    border: 1px solid black;
    border-radius: 5px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
