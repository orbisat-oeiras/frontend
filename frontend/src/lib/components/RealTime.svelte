<script lang="ts">
    import { States } from "../../types";
    import Map from "./Map.svelte"
    import Ndvi from "./NDVI.svelte";

    export let state: States = States.NDVI;

    // THIS CODE IS RELATED TO THE MAP TAB.
    export let latitude: number;
    export let longitude: number;
</script>

{#if state == States.GPS}
    <Map latitude={latitude} longitude={longitude} />
{:else if state == States.NDVI}
    <div class="tab">
        <Ndvi/>
    </div>
{/if}

<style>
    .tab {
        height:400px;
        width:100px;
    }
</style>