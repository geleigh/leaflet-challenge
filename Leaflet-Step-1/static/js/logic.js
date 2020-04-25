// Leaflet HOMEWORK

// Setup map in California
var myMap = L.map("map", {
    center: [36.7783, -119.4179],
   zoom: 5
  });

// Create the tile layer
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

// Establish colors for circles and squares in legend
function getColor(d) {
  return d > 5 ? '#943126' :
         d > 4  ? '#CB4335' :
         d > 3  ? '#E74C3C' :
         d > 2  ? '#EC7063' :
         d > 1   ? '#F5B7B1' :
         d > 0   ? '#FADBD8' :
                    '#F8F9F9';
}

var quakeData;
// Put GeoJSON in queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  jsonData = data;

  // Establish variables from json data
  data.features.forEach(obj => {
    var lat = obj.geometry.coordinates[1];
    var lng = obj.geometry.coordinates[0];
    var mag = obj.properties.mag;
    var city = obj.properties.place;

  //Create circles based on size of the earthquake and add bind-popup
    L.circle([lat, lng], {
      stroke: false,
      fillOpacity: .5,
      color: getColor(mag),
      fillColor: getColor(mag),
      radius: mag * 50000
    }).bindPopup("<p>" + city + "</p><p>Magnitude: " + mag + "</p>",{maxWidth:100}).addTo(myMap);
  });
});

//Create legend for bottom right corner of map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        mags = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our magintudes and generate a label with a colored square for each interval
    for (var i = 0; i < mags.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
            mags[i] + (mags[i + 1] ? ' to ' + mags[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
