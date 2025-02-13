// geojson from earthquake.usgs.gov website 
var quake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"; 
d3.json(quake_url).then(function(response) {
    console.log(response);
    console.log(response.features);
    var quakemarkers = [];
    //set up a new marker for each item with a for loop
    for (var i = 0; i < response.features.length; i++) { 
        var location = response.features[i].geometry; 
        var properties = response.features[i].properties;
        var color = "";
        if (location) { //and if you can unfurl location you pick the coordinates
        // Conditionals for earthquake depth
            if (location.coordinates[2] >= 90) {
                color = "#FF0D0D";
            }
            else if (location.coordinates[2] <= 89 && location.coordinates[2] >= 70) {
                color = "#FF4E11";
            }
            else if (location.coordinates[2] <= 69 && location.coordinates[2] >= 50) {
                color = "#FF8E15";
            }
            else if (location.coordinates[2] <= 49 && location.coordinates[2] >= 30) {
                color = "#FAB733";
            }
            
            else if (location.coordinates[2] <= 29 && location.coordinates[2] >= 10) {
                color = "#ACB334";
            }
            else {
                color = "#69B34C";
            }
        // Listing the coordinates 
        quakemarkers.push(
        // Add circles to map
        L.circleMarker([location.coordinates[1], location.coordinates[0]], {
            fillOpacity: 0.75,
            color: "black",
            weight: 1,
            fillColor: color,
            // Adjust radius by 
            radius: properties.mag * 5
        }).bindPopup("<h1>" + properties.place + "</h1> <hr> <h3>Magnitude: " + properties.mag + "</h3>")
        );
        }
    }
    // Create layers for two different data sets.
    var cityLayer = L.layerGroup(quakemarkers);
    var tectonicPlates = L.layerGroup(tectonicPlates);

    //BONUS
    // geojson from github.com/fraxen/tectonicplates
    var t_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
    d3.json(t_url).then(function(data) {
    console.log(data);  
    // Listing the boundaries
    // Add lines to map
    L.geoJson(data, {
        //Adjust color and width of line
        color: "pink", weight: 3
    }).addTo(tectonicPlates)
    });

    // Adding tile layer
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        accessToken: API_KEY
    });
    
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var out = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v11",
        accessToken: API_KEY
    });
    // Only one base layer can be shown at a time
    var baseMaps = {
        Satellite: satellite,
        Grayscale: light,
        Outdoors: out
        };
    // Overlays that may be toggled on or off
    var overlayMaps = {
        Earthquakes: cityLayer,
        "Tectonic Plates": tectonicPlates
        };
    var myMap = L.map("map", {
        center: [30.7, -110],
        zoom: 5,
        layers:[satellite, cityLayer, tectonicPlates]
    });
    
    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
    //--------
    function getColor(d) {
        return d > 90 ? '#FF0D0D' :
               d > 70 ? '#FF4E11' :
               d > 50 ? '#FF8E15' :
               d > 30 ? '#FAB733' :
               d > 10 ? '#ACB334' :
                        '#69B34C' ;
    }
    // Set up the legend control object 
    var legend = L.control({ position: "bottomright" }); 
    legend.onAdd = function(myMap) {
        // Placing a new div with two different classes
        var div = L.DomUtil.create("div", "info legend"); 
            categories = [-10, 10, 30, 50, 70, 90];
            labels = []
        console.log(categories)

        // loop through categories intervals and generate a label with a colored square for each interval
        
        for (var i = 0; i < categories.length; i++) {
            div.innerHTML += 
                '<i style="background:' + getColor(categories[i] + 1) + '"></i> ' +
                categories[i] + (categories[i + 1] ? '&ndash;' + categories[i + 1] + '<br>' : '+');

        }
        return div;
       
    };

    // Adding legend to the map
    legend.addTo(myMap);

})  
