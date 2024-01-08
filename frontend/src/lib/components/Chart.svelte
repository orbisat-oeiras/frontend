<script lang="ts">
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;

  export let title: string[] = [""];
  export let labels: Array<string>;
  // Color of the small dots in each of the data points
  export let backgroundColor: Array<string> = ["rgb(215,127,43)"];
  // Color of the rest of the line
  export let borderColor: Array<string> = ["rgb(215,127,43)"];
  export let data: number[];
  export let showLegends = false;

  // This function runs when the chart is mounted to the DOM
  onMount(async () => {
    // If we cant get the context, an error is thrown
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) {
      throw new Error("Failed to get 2D context");
    }
    // Create the chart
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            backgroundColor,
            borderColor,
            data,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: title,
          },
          legend: {
            display: showLegends,
            position: "bottom",
          },
        },
      },
    });
  });
</script>

<!-- Bind the canvas for the graph with the canvas element -->
<canvas bind:this={canvas}></canvas>
