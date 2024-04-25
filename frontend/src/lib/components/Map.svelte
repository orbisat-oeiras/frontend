<script lang="ts">
    import * as L from 'leaflet'
    import 'leaflet/dist/leaflet.css'

    export let latitude: number;
    export let longitude: number;

    // Location for the map to start at.
    const location = [36.9536, -25.0499]

    function createMap(container: any) {
        let map = L.map(container).setView([location[0], location[1]], 13);
        // We are getting the maps and tiles from https://www.openstreetmap.org/. 
        // It is a free service, but they require giving appropriate crediting (attribution).
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        return map;
    }
    
    function mapAction(container: any) {
        map = createMap(container);
        return {
            destroy: () => {
                map.remove();
            },
        };
    }

    let map: L.Map

    $: {
        if (typeof map !== 'undefined' && latitude != 0) {
            L.marker([latitude, longitude]).addTo(map);
        }
    }
</script>

<div id="map" style="height:50vh;width:150%; transform:translate(-15%)" use:mapAction/>