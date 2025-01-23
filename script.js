let map = L.map("map").setView([28.76765, 83.3203], 5);

map.createPane("left");
map.createPane("right");

let osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var Dark = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}",
  {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: "png",
  }
);

var Water = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}",
  {
    minZoom: 1,
    maxZoom: 16,
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: "jpg",
  }
);

var googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    pane: "right",
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
).addTo(map);

// ====================================
// if (!navigator.geolocation) {
//   console.log("Error");
// } else {
//   navigator.geolocation.getCurrentPosition(getPostion);
// }

// function getPostion(postion) {
//   console.log(postion);
// }
//===========================// marker
// let mark = L.marker([28.76765, 83.3203], {
//   draggable: true,
//   title: "hello",
// }).addTo(map);
// get location =========================================

L.control
  .measure({
    position: "bottomleft",
    primaryLengthUnit: "kilometers",
    secondaryLengthUnit: "meters",
    primaryAreaUnit: "kilometers",
    secondaryAreaUnit: undefined,
  })
  .addTo(map);
// ============================================================================add data from geoJson

let nepalDistrict = L.geoJson(nepalGeoJsonData, {
  onEachFeature: function (feature, layer) {
    area = (turf.area(feature) / 1000000).toFixed(2);
    // center_lat = console.log(area);
  },
});
let nepalHq = L.geoJSON(hqData);

nepalDistrict.addTo(map);
nepalHq.addTo(map);

baseLayer = {
  OSM: osm,
  Dark: Dark,
  Water: Water,
  // Imagery: Imagery,
  // NASAGIBS: NASAGIBS,
};

otherLayers = {
  "nepal District": nepalDistrict,
  "nepal Headquater": nepalHq,
};

L.control.layers(baseLayer, otherLayers, { collapse: false }).addTo(map);
// =============================================== create tabel coordinate==
let tbale = document.querySelector("table");
map.on("click", function (ev) {
  let templet = `
  <tbody>
            <thead>
              <td>lat</td>
              <td>long</td>
            </thead>
          </tbody>
            <tr>
              <td>
                ${ev.latlng.lat}
              </td>
              <td>${ev.latlng.lng}</td>
            </tr>`;

  tbale.innerHTML += templet;
});
// ================================================
// print
$(".print").click(function () {
  window.print();
});
L.control.browserPrint().addTo(map);
// search===================================
L.Control.geocoder().addTo(map);
// zoom to layer========================================================================================
$(".zoom-to-layer").click(function () {
  map.setView([26.1554, 30.4101], 5);
});

var lc = L.control
  .locate({
    position: "bottomleft",

    strings: {
      title: "Show me where I am, yo!",
    },
  })
  .addTo(map);
// ============================================togel side bar
var sideBySideControl = null;

function toggleSplitter() {
  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  } else {
    sideBySideControl = L.control.sideBySide(osm, googleSat).addTo(map);
  }
}
document
  .getElementById("toggleSplitterBtn")
  .addEventListener("click", toggleSplitter);
