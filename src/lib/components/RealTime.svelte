<script lang="ts">
  import { States } from "../../types";
  import Map from "./Map.svelte";
  export let state: States = States.GPS;

  // THIS CODE IS RELATED TO THE MAP TAB.
  export let latitude: number;
  export let longitude: number;
  export let timestamp: string;
  export let height: string = "50vh";
  export let width: string = "100%";
</script>

{#if state == States.GPS}
  <Map {latitude} {longitude} {timestamp} {height} {width} />
{/if}
