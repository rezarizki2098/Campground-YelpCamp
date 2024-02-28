mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "cluster-map", // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 12, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h5>${campground.title}</h5><p>${campground.location}</p>`))
    .addTo(map);
