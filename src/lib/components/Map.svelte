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
    let map = L.map(container).setView([location[0], location[1]], 13);
    // We are getting the maps and tiles from https://www.openstreetmap.org/.
    // It is a free service, but they require giving appropriate crediting (attribution).
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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

  $: {
    if (
      typeof map !== "undefined" &&
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      typeof timestamp === "string" &&
      !isNaN(latitude) &&
      !isNaN(longitude)
    ) {
      const marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup(`<b>Timestamp:</b> ${timestamp}`);
    }
  }
</script>

<div
  id="map"
  style="height:50vh;width:150%; transform:translate(-15%); margin-bottom: 23%;"
  use:mapAction
/>
