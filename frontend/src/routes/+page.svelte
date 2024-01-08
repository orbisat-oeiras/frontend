<script lang="ts">
  import Chart from "../lib/components/Chart.svelte";
</script>

<h1>This is a test to see if the chart component is working</h1>

<section>
  <Chart
    title={["test"]}
    labels={["1", "2", "3", "4"]}
    backgroundColor={["gold"]}
    data={[5, 3, 7, 2]}
  />
</section>
