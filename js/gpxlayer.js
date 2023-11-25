const startDate = new Date();
startDate.setUTCHours(0, 0, 0, 0);

const map = L.map('map', {
    zoom: 5,
    fullscreenControl: true,
    center: [37.0, 137.5]
});

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
    iconUrl: 'img/running.png',
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

var gpxLayer;
var gpxTimeLayer;

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

const overlayMaps = {};
const baseLayers = getCommonBaseLayers(map);
L.control.layers(baseLayers, overlayMaps).addTo(map);
