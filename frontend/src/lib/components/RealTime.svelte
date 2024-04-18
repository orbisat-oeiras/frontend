<script lang="ts">
    import { States } from "../../types";
    export let state: States = States.NDVI;
    import { onMount } from "svelte";
</script>
{#if state == States.GPS}
    <div id="map">

    </div>
{/if}