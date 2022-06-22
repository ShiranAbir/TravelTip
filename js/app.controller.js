import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onPanToUserLocation = onPanToUserLocation
window.onCopyLocation = onCopyLocation
window.onSearch = onSearch


function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            getParams()
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`

        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}

function onPanToUserLocation() {
    getPosition()
        .then(pos => {
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
            console.log('User position is:', pos.coords);
            mapService.addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}


function getParams() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    })
    if (!params.lat || !params.lng) return

    mapService.panTo(params.lat, params.lng)
    mapService.addMarker({ lat: params.lat, lng: params.lng })
}

function onCopyLocation(){
    var mapPos = mapService.getMapPos()
    var url = `https://shiranabir.github.io/TravelTip/?lat=${mapPos.lat}&lng=${mapPos.lng}`
    navigator.clipboard.writeText(url)
    alert('Link copied!')
}

function onSearch(){
    var location = document.querySelector('.location-input').value
    mapService.searchAddress(location).then(res=>processSearchResults(res))
}

function processSearchResults(res) {
    var pos = res.data.results[0].geometry.location
    mapService.panTo(pos.lat, pos.lng)
    mapService.addMarker({ lat: pos.lat, lng: pos.lng })
}