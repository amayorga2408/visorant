let map = L.map('map').setView([4.639386, -74.082412], 5.4)

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map)
document.getElementById('select-location').addEventListener('change', function(e){
    let coords= e.target.value.split(",");
    map.flyTo(coords,13);
 })


var carto_light = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png', {attribution: '©OpenStreetMap, ©CartoDB',subdomains: 'abcd',maxZoom: 24});


var minimap = new L.Control.MiniMap(carto_light, 
    {
       toggleDisplay: true,
       minimized: false,
       position: "bottomleft"
    }).addTo(map);


new L.control.scale({imperial: false}).addTo(map);


function stylePolygon(deptos, solidColor) {
    if (solidColor) {
      return {
        weight: 1, 
        color: '#24FE90', 
        opacity: 0.8, 
        fillOpacity: 0, 
        fillColor: '#BFD641' 
      };
    } else {
      return {
        weight: 0.8, 
        color: '#84952A', 
        opacity: 0.8, 
        fillOpacity: 0 
      };
    }
  }
  
  var polygon = new L.geoJson(Depto84, {
    style: function(feature) {
      return stylePolygon(feature, false);
    }
  }).addTo(map);

  var polygon = new L.geoJson(deptos, {
    style: function(feature) {
      return stylePolygon(feature, true);
    }
  }).addTo(map);
  


function popup(feature, layer) {
  if (feature.properties && feature.properties.ID_ANT) {
      var popupContent = "<strong>ID_ANT : </strong>" + feature.properties.ID_ANT + "<br/>" +
          "<strong>Codigo: </strong>" + feature.properties.CODIGO + "<br/>" +
          "<strong>Departamento: </strong>" + feature.properties.DEPTO + "<br/>" +
          "<strong>Municipio: </strong>" + feature.properties.MPIO + "<br/>" +
          "<strong>Predio: </strong>" + feature.properties.PREDIO + "<br/>" +
          "<strong>FMI: </strong>" + feature.properties.FMI + "<br/>" +
          "<strong>Avalúo: </strong>" + feature.properties.AVALUO + "<br/>" +
          "<strong>Área: </strong>" + feature.properties.AREA + "<br/>" +
          "<strong>Operador: </strong>" + feature.properties.OPERADOR + "<br/>" +
          "<strong>Informe: </strong>" + feature.properties.INFORME;

      if (feature.properties.INFORME) {
          console.log("URL: " + feature.properties.INFORME); 
          popupContent += "<br/><a href='" + feature.properties.INFORME + "' target='_blank'>Abrir información</a>";
      }

      layer.bindPopup(popupContent);
  }
}

var lonjacunJS = L.geoJson(lonjacun, {
  onEachFeature: popup
}).addTo(map);

var geovaloresJS = L.geoJson(geovalores, {
    onEachFeature: popup
}).addTo(map);



lonjacunJS.setStyle({
  weight: 1, 
  color: '#ff0000' , 
  opacity: 0.7, 
  fillOpacity: 0, 
  fillColor: '#BFD641'  
});

geovaloresJS.setStyle({
  weight: 1, 
  color: '#FAAC58' , 
  opacity: 0.7, 
  fillOpacity: 0, 
  fillColor: '#BFD641' 
});


var searchControl = new L.Control.Search({
    layer:L.layerGroup([lonjacunJS, geovaloresJS]),
    propertyName: 'ID_ANT',
    circleLocation: false

});

searchControl.on('search:locationfound', function(e){
    e.layer.setStyle({fillColor:'#3f0',color:'#0f0'});
})
map.addControl(searchControl);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML += '<div class="legend-title">CONVENCIONES</div>'
  div.innerHTML += '<div class="legend-item"><div class="legend-color" style="background-color: #FAAC58;"></div>Geovalores</div>';
  div.innerHTML += '<div class="legend-item"><div class="legend-color" style="background-color: #00BFFF;"></div>Avaluar Valores</div>';
  div.innerHTML += '<div class="legend-item"><div class="legend-color" style="background-color: #ff0000;"></div>Lonja de Cundinamarca</div>';
  return div;
};

legend.addTo(map);

