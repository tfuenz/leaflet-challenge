let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function createMap(earthquakes) {

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    let baseMaps = {
      "Base Map": street
    };
  
    let overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    let myMap = L.map("map", {
      center: [38.0902, -95.7129],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    let legend = L.control({
        position: 'bottomright'
    });
    
    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'legend');
            div.innerHTML += '<h4>Legend</h4>';
            div.innerHTML += '<div><i class="very-deep"></i> Very Deep</div>';
            div.innerHTML += '<div><i class="deep"></i> Deep</div>';
            div.innerHTML += '<div><i class="moderate-depth"></i> Moderate Depth</div>';
            div.innerHTML += '<div><i class="moderate-shallow"></i> Moderate Shallow</div>';
            div.innerHTML += '<div><i class="shallow"></i> Shallow</div>';
            div.innerHTML += '<div><i class="very-shallow"></i> Very Shallow</div>';
        
            div.querySelectorAll('i').forEach(function(icon) {
                switch(icon.className) {
                    case 'very-deep':
                        icon.style.backgroundColor = '#800000';
                        break;
                    case 'deep':
                        icon.style.backgroundColor = '#ff0000';
                        break;
                    case 'moderate-depth':
                        icon.style.backgroundColor = '#ff6600';
                        break;
                    case 'moderate-shallow':
                        icon.style.backgroundColor = '#ffcc00';
                        break;
                    case 'shallow':
                        icon.style.backgroundColor = '#ffff00';
                        break;
                    case 'very-shallow':
                        icon.style.backgroundColor = '#99ff33';
                        break;
                    default:
                        break;
                }
            });
        
            return div;
    };
    
    legend.addTo(myMap);
  };

function getColor(depth) {
    if (depth > 90) {
        return '#800000'
    }
    else if (depth > 70) {
        return '#ff0000'
    }
    else if (depth > 50) {
        return '#ff6600'
    }
    else if (depth > 30) {
        return '#ffcc00'
    }
    else if (depth > 10) {
        return '#ffff00'
    }
    else {
        return '#99ff33'
    }
};

function createMarkers(response) {
   let EQ = response.features;
   earthquakeMarkers = []

   for (let i = 0; i < EQ.length; i++) {
      earthquakeMarkers.push(
        L.circle([EQ[i].geometry.coordinates[1], EQ[i].geometry.coordinates[0]], {
            color: 'black',
            fillColor: getColor(EQ[i].geometry.coordinates[2]),
            fillOpacity: 0.5,
            radius: 10000*EQ[i].properties.mag,
            weight: 1
        }).bindPopup("<h1>Magnitude: " + EQ[i].properties.mag + "<h1>Latitude: " + EQ[i].geometry.coordinates[1] + "<h1>Longitude: " + EQ[i].geometry.coordinates[0] + "</h1>")
      );
    };

    createMap(L.layerGroup(earthquakeMarkers));
  };

d3.json(queryUrl).then(createMarkers);