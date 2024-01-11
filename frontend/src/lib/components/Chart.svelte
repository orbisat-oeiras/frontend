<script lang="ts">
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;

  // The title of the chart.
  // Added it in to show the titles.
  // However, since it was easier to style it by adding an <h1> in the html page, it is unlikely to be used.
  export let title: string[] = [""];
  // The labels that appear on the x axis.
  // Since in this project it will mostly represent the time, it will likely be ["1", "2", "3", "4", "5"...].
  export let labels: Array<string>;
  // Color of the small dots in each of the data points.
  export let backgroundColor: Array<string> = ["rgb(215,127,43)"];
  // Color of the rest of the line.
  export let borderColor: Array<string> = ["rgb(215,127,43)"];
  // The data (such as the value of the pressure or the temperature).
  export let data: number[];
  // If true, shows a label for the line in the chart.
  // I only added it because maybe we will have more than one line for the altitude chart.
  export let showLegends = false;

  // This function runs when the chart is mounted to the DOM.
  onMount(async () => {
    // This is used so we can get a nice canvas to draw the chart on.
    // If we cant get the context, an error is thrown.
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) {
      throw new Error("Failed to get 2D context");
    }
    // Create the chart.
    const chart: Chart = new Chart(ctx, {
      // The type of the chart (line, pie, bar, etc...). In this case it is always going to be a line chart.
      type: "line",
      // This is associated with the data that is shown on the x and y axis, as well as the styling of the line.
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
      // Other options related to the chart.
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        maintainAspectRatio: false,
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
<div
  class="chart-container"
  style="position: relative; height:25vh; width:30vw"
>
  <canvas bind:this={canvas}></canvas>
</div>
