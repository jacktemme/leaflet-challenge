# leaflet-challenge


  let colorScale = d3.scaleThreshold().domain(thresholds).range(colors)
  let color = colorScale(depth)

Make the legend have a white box around it:

      .info.legend {
  background-color: white;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}
