module.exports = async function (origin, destination) {
    return fetch("/api/fetchDistanceBetweenPlaces?origin=" + origin + "&destination=" + destination, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
    })
}