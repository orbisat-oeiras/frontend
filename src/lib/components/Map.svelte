<script lang="ts">
  import * as L from "leaflet";
  import "leaflet/dist/leaflet.css";

  export let latitude: number;
  export let longitude: number;
  export let timestamp: string;

  // Location for the map to start at.
  const location = [36.9503339, -25.08];

  function createMap(container: HTMLElement) {
    console.log(typeof container);
    let map = L.map(container).setView([location[0], location[1]], 12);
    // We are getting the maps and tiles from https://www.openstreetmap.org/.
    // It is a free service, but they require giving appropriate crediting (attribution).
    L.tileLayer("maps/Ilha de Santa Maria/{z}/{x}/{y}.png", {
      maxZoom: 16,
    }).addTo(map);

    return map;
  }

  function mapAction(container: HTMLElement) {
    map = createMap(container);
    return {
      destroy: () => {
        map.remove();
      },
    };
  }

  let map: L.Map;
  let currentMarker: L.Marker | null = null;

  $: {
    if (
      typeof map !== "undefined" &&
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      typeof timestamp === "string" &&
      !isNaN(latitude) &&
      !isNaN(longitude)
    ) {
      if (currentMarker) {
        map.removeLayer(currentMarker);
      }
      currentMarker = L.marker([latitude, longitude]).addTo(map);
      currentMarker.bindPopup(`Timestamp: ${timestamp}`).openPopup();
    }
  }
</script>

<div id="map" style="height:50vh; width: 100%;" use:mapAction />
