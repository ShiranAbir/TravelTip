
export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMapPos,
    searchAddress
}

var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
            gMap.addListener("click", (mapsMouseEvent) => {
                const location = mapsMouseEvent.latLng
                addMarker(location)
            })
        })
}

function addMarker(location) {//({ location, id, name }) {
    //console.log('location, id, name', location, id, name)
    const marker = new google.maps.Marker({
        position: location,
        map: gMap,
        //id,
        title: 'Miki mouse',
    })

}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    // const API_KEY = ''; //TODO: Enter your API eyK
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${gAPIKey}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getMapPos() {
    var lat = gMap.getCenter().lat()
    var lng = gMap.getCenter().lng()
    return { lat, lng }
}

function searchAddress(location) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${gAPIKey}`)
}