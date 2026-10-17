<script lang="ts">
  import * as L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { onDestroy } from "svelte";

  export let latitude: number;
  export let longitude: number;
  export let timestamp: string;
  export let height: string = "50vh";
  export let width: string = "100%";

  let map: L.Map | undefined;
  let currentMarker: L.Marker | null = null;
  let isDestroyed = false;

  function createMap(container: HTMLElement) {
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    const initialLat = typeof latitude === "number" && !isNaN(latitude) ? latitude : 0;
    const initialLng = typeof longitude === "number" && !isNaN(longitude) ? longitude : 0;

    let mapInstance = L.map(container).setView([initialLat, initialLng], 16);
    // We are getting the maps and tiles from https://www.openstreetmap.org/.
    // It is a free service, but they require giving appropriate crediting (attribution).
    // L.tileLayer("maps/Ilha de Santa Maria/{z}/{x}/{y}.png", {
    //   maxZoom: 16,
    // }).addTo(mapInstance);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstance);

    return mapInstance;
  }

  function cleanup() {
    isDestroyed = true;
    if (map) {
      map.remove();
      map = undefined;
    }
    currentMarker = null;
  }

  function mapAction(container: HTMLElement) {
    map = createMap(container);
    return {
      destroy: () => {
        cleanup();
      },
    };
  }

  onDestroy(() => {
    cleanup();
  });

  $: {
    if (
      !isDestroyed &&
      map &&
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      typeof timestamp === "string" &&
      !isNaN(latitude) &&
      !isNaN(longitude)
    ) {
      if (currentMarker) {
        currentMarker.setLatLng([latitude, longitude]);
        currentMarker.setPopupContent(`Timestamp: ${timestamp}`);
      } else {
        currentMarker = L.marker([latitude, longitude]).addTo(map);
        currentMarker.bindPopup(`Timestamp: ${timestamp}`).openPopup();
      }
    }
  }
</script>

<div style="height:{height}; width: {width};" use:mapAction />
