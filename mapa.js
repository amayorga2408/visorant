let map = L.map('map').setView([4.639386, -74.082412], 5.4);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);

document.getElementById('select-location').addEventListener('change', function(e){
    let coords= e.target.value.split(",");
    map.flyTo(coords, 13);
});

var carto_light = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png', {
    attribution: '©OpenStreetMap, ©CartoDB',
    subdomains: 'abcd',
    maxZoom: 24
});

var minimap = new L.Control.MiniMap(carto_light, {
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


