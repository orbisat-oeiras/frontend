<script lang="ts">
    import { States } from "../../types";
    export let state: States = States.NDVI;
    $: console.log(state);
</script>
