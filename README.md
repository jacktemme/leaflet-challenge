# leaflet-challenge


var colorScale = d3.scaleSequential(d3.interpolateHslLong("green", "red"))
                               .domain([0, 100]); // Adjust domain based on your data range

            // Get the color based on the value
            var color = colorScale(value);
