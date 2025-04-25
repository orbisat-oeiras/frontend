<script lang="ts">
  import Chart from "chart.js/auto";
  import { onMount } from "svelte";
  import { Filler } from "chart.js/auto";

  let canvas: HTMLCanvasElement;
  let chart: Chart;

  // The title of the chart.
  export let title: string[] = [""];
  // The labels that appear on the x axis.
  // Since in this project it will mostly represent the time, it will likely be ["1", "2", "3", "4", "5"...].
  export let labels: Array<string>;
  // The data (such as the value of the pressure or the temperature).
  export let datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[] = [];
  // If true, shows a label for the line in the chart.
  // I only added it because maybe we will have more than one line for the altitude chart.
  export let showLegends = false;

  // This function runs when the chart is mounted to the DOM.
  onMount(() => {
    // This is used so we can get a nice canvas to draw the chart on.
    // If we cant get the context, an error is thrown.
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) {
      throw new Error("Failed to get 2D context");
    }
    var gradient = ctx.createLinearGradient(0, 0, 0, 510);
    gradient.addColorStop(0, "rgba(250,174,50,1)");
    gradient.addColorStop(0, "rgba(250,174,50,0)");
    // Create the chart.
    chart = new Chart(ctx, {
      // The type of the chart (line, pie, bar, etc...).
      // In this case it is always going to be a line chart.
      type: "line",
      // This is associated with the data that is shown on the x and y axis, as well as the styling of the line.
      data: {
        labels,
        datasets: datasets.map((ds) => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.borderColor ?? "rgb(215,127,43)",
          backgroundColor: ds.backgroundColor ?? "rgba(215,127,43,0.2)",
          fill: false,
          tension: 0.3,
        })),
      },
      // Other options related to the chart.
      options: {
        elements: {
          point: {
            radius: 0,
          },
        },
        animation: {
          duration: 150,
          easing: "easeInOutQuad",
        },
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
                family: "Lato",
                size: 15,
                weight: 500,
                lineHeight: 1.2,
              },
              padding: { top: 0, bottom: 17.5 },
              align: "start",
            },
            // This add the 's' (for seconds) to the data in the x axis.
            ticks: {
              callback: (value, index, ticks) => value + "",
            },
          },
          y: {
            beginAtZero: false,
            // This add the unit to the data in the y axis.
            ticks: {
              callback: function (value, index, values) {
                return typeof value === "number" ? value.toFixed(1) : value; // Round to 1 decimal
              },
            },
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

    return () => {
      chart.destroy();
    };
  });
  $: if (chart && datasets) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = datasets[0].data;
    chart.update("active");
  }
</script>

<!-- 
  This div is used to set a height and width to the area where the chart is drawn, 
  based on the size of the viewport (therefore adjusting the size of the charts based on the size of the screen).
-->
<div
  class="chart-container"
  style="position: relative; height:30vh; width:30vw"
>
  <!-- Bind the canvas for the graph with the canvas element -->
  <canvas bind:this={canvas}></canvas>
</div>
