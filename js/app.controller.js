import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { gMap } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onPanToUserLocation = onPanToUserLocation
window.onCopyLocation = onCopyLocation
window.onSearch = onSearch

var gPlaces = []

function onInit() {
    mapService.initMap()
        .then((city, country) => {
            console.log('Map is ready')
            getParams()
            
            gMap.addListener("click", markLocation)
        })
        .catch(() => console.log('Error: cannot init map'))
}

function markLocation(e){
    const location = e.latLng
    mapService.addMarker(location)
    showLocationName(location)
}

function renderLocationsTable(){
    const placesTable = document.querySelector('.locations-table')
    let strHTML = ''
    strHTML = gPlaces.map(place => `<div class='places-table-row'>${place}</div>`)
    //strHTML = gPlaces.foreach(place => strHTML +=`<div class='places-table-row'>${place}</div>`)
    placesTable.innerHTML = strHTML
}

function showLocationName(location){
    mapService.getLocationName(location)
    .then((res) => {
        const locationElm = document.querySelector('.location span')
        const address = res.streetNumber + ' ' + res.streetName + ' ' + res.cityName + ' ' + res.countryName
        locationElm.innerHTML = address
        if(!gPlaces.includes(address))
            gPlaces.push(address)

        renderLocationsTable()
    })
    .catch(() => console.log('Error: cannot find location name'))
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
    mapService.searchAddress(location).
    then(res=>processSearchResults(res))
}

function processSearchResults(res) {
    var pos = res.data.results[0].geometry.location
    mapService.panTo(pos.lat, pos.lng)
    mapService.addMarker({ lat: pos.lat, lng: pos.lng })
    showLocationName(pos)
}