
export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMapPos,
    searchAddress,
    getLocationName
}

export var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('.map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
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

function getLocationName(location) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({'latLng': location}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                const address = results[0].address_components
                resolve(_getAddressString(results))
            } else {
                reject("Geocode was not successful for the following reason: " + status)

            }
        })
    })
}

function _getAddressString(addressData){
    let address = addressData[0].address_components
    let streetNumber = ''
    let streetName = ''
    let cityName = ''
    let countryName = ''

    for(let i=0; i < address.length; i++){
        if(address[i].types.includes('street_number')){
            streetNumber = address[i].long_name
        }else if(address[i].types.includes('route')){
            streetName = address[i].long_name ? address[i].long_name + ' St.' : ''
        }else if(address[i].types.includes('locality')){
            cityName = address[i].long_name ? address[i].long_name + ', ' : ''
        }else if(address[i].types.includes('country')){
            countryName = address[i].long_name
        }
    }

    return {streetNumber, streetName, cityName, countryName}
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