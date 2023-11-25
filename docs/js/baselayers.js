/* 
*    Return common layers used in different examples
*/
function getCommonBaseLayers(map){
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