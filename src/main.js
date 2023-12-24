import L from 'leaflet'
import 'leaflet-timedimension'
import omnivore from '@mapbox/leaflet-omnivore'
import 'leaflet-easybutton'

import 'leaflet/dist/leaflet.css'
import 'leaflet-timedimension/dist/leaflet.timedimension.control.min.css'
import 'leaflet-easybutton/src/easy-button.css'
import 'font-awesome/css/font-awesome.min.css'
import './style.css'

import runningImg from './running.png'

const getCommonBaseLayers = (map) => {
    var gsiLayer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
        attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
    });
    var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });   
    gsiLayer.addTo(map);
    return {
        "地理院地図": gsiLayer,
        "OSM": osmLayer
    };
}

const map = L.map('map', {
    zoom: 5,
    fullscreenControl: true,
    center: [37.0, 137.5]
});

const startDate = new Date();
startDate.setUTCHours(0, 0, 0, 0);

const timeDimension = new L.TimeDimension({
    period: "PT1M",
});
map.timeDimension = timeDimension; 

const player = new L.TimeDimension.Player({
    transitionTime: 200, 
    loop: false,
    startOver:true
}, timeDimension);

const timeDimensionControlOptions = {
    player:        player,
    timeDimension: timeDimension,
    position:      'bottomleft',
    autoPlay:      true,
    minSpeed:      1,
    speedStep:     1,
    maxSpeed:      100,
    timeSliderDragUpdate: true,
    timeZones:     ["Local", "UTC"]
};

const timeDimensionControl = new L.Control.TimeDimension(timeDimensionControlOptions);
map.addControl(timeDimensionControl);

const icon = L.icon({
    iconUrl: runningImg,
    iconSize: [22, 22],
    iconAnchor: [5, 25]
});

const customLayer = L.geoJson(null, {
    pointToLayer: function (feature, latLng) {
        if (feature.properties.hasOwnProperty('last')) {
            return new L.Marker(latLng, {
                icon: icon
            });
        }
        return L.circleMarker(latLng);
    }
});

let gpxLayer;
let gpxTimeLayer;

const fileElem = document.getElementById("selfile");
fileElem.addEventListener("change", (evt) => {
    let file = evt.target.files;
    let reader = new FileReader();
    reader.readAsText(file[0]);
    reader.onload = (ev) => {
        if (gpxTimeLayer) {
            map.removeLayer(gpxTimeLayer);
        }
        customLayer.clearLayers();
        gpxLayer = null;
        gpxTimeLayer = null;
        gpxLayer = omnivore.gpx.parse(reader.result, null, customLayer);
        gpxTimeLayer = L.timeDimension.layer.geoJson(gpxLayer, {
            updateTimeDimension: true,
            addlastPoint: true,
            waitForReady: true
        });
        gpxTimeLayer.addTo(map);
        console.log(gpxLayer.getBounds());
        map.fitBounds(gpxLayer.getBounds(), {
            paddingBottomRight: [40, 40]
        });
    }
}, false);
L.easyButton('fa-file', (evt) => {
    fileElem.click();
}).addTo(map);

const overlayMaps = {};
const baseLayers = getCommonBaseLayers(map);
L.control.layers(baseLayers, overlayMaps).addTo(map);
