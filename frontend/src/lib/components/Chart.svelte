<script lang="ts">
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;

  // The title of the chart.
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
      // The type of the chart (line, pie, bar, etc...).
      // In this case it is always going to be a line chart.
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
        // This option makes sure the chart is not trying to keep a defined aspect ratio,
        // because that messes up with it when it is resized.
        // Instead, the aspect ratio is defined by the div the chart is drawn on.
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            // This is all related to the way the title of the chart is displayed
            title: {
              display: true,
              text: title,
              color: "rgb(215, 127, 43)",
              font: {
                family: "Open Sans",
                size: 30,
                weight: "bold",
                lineHeight: 1.2,
              },
              padding: { top: 0, bottom: 35 },
              align: "start",
            },
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: showLegends,
            position: "bottom",
          },
        },
      },
    });
  });
</script>

<!-- 
  This div is used to set a height and width to the area where the chart is drawn, 
  based on the size of the viewport (therefore adjusting the size of the charts based on the size of the screen).
-->
<div
  class="chart-container"
  style="position: relative; height:28vh; width:30vw"
>
  <!-- Bind the canvas for the graph with the canvas element -->
  <canvas bind:this={canvas}></canvas>
</div>
