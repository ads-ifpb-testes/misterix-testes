var map, myMarker, myIcon;

window.setUpMap = (canSetMarker) => {
    myIcon = L.icon({
        iconUrl: './question-icon.svg',
        iconSize: [38, 95],
        iconAnchor: [20, 40],
        popupAnchor: [0, -15],
    });

    map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    if(canSetMarker){
        map.on('click', (e) => {
            if(!myMarker)
                myMarker = L.marker(e.latlng, {icon: myIcon}).addTo(map);
            else
                myMarker.setLatLng(e.latlng);
    
            map.setView(e.latlng);
            myMarker.bindPopup("Sua localização.");
        });
    }
}

window.setCurrentLocation = () => {
    map.locate();
    map.once('locationfound', (e) => map.setView(e.latlng));
}

window.setLocation = (coordinates) => {
    map.setView(coordinates, 13);
}

window.getMarker = () => {
    return myMarker;
}

window.setMarker = (location, title) => {
    const marker = L.marker(location, {icon: myIcon}).addTo(map);
    marker.bindPopup(title);
}

window.invalidateSize = () => {
    map.invalidateSize();
}