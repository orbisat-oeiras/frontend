<script lang="ts">
  import Chart from "../lib/components/Chart.svelte";
  import { States } from "../types";
  import { onMount } from "svelte";
  import logo from "$lib/images/OrbisatLogo.png";
  import gif from "$lib/images/Speed-of-sound.gif";

  // This code is related to getting the data from the server.

  // The data is organized as a dictionary of datapoints.
  // When applicable, these are devided as an array of arrays containing the time (String) followed by the data (Number).
  type Datapoint = [[string | undefined, Number | undefined]];
  type Data = {
    pressure: Datapoint;
    altitude: Datapoint;
    temperature: Datapoint;
    accelerationx: Datapoint;
    accelerationy: Datapoint;
    accelerationz: Datapoint;
    latitude: number;
    longitude: number;
  };
  let data: Data = {
    pressure: [[undefined, undefined]],
    altitude: [[undefined, undefined]],
    temperature: [[undefined, undefined]],
    accelerationx: [[undefined, undefined]],
    accelerationy: [[undefined, undefined]],
    accelerationz: [[undefined, undefined]],
    latitude: 0,
    longitude: 0,
  };
  var backend: string = "";
  var videoSource: string = "";
  onMount(async () => {
    var backend = String(
      prompt(
        "Insert the server (default is https://localhost:7097/api/SSE) - ",
      ),
    );
    var videoSource = String(
      prompt(
        "Insert the video source (default is http://localhost:8000/master.m3u8) - ",
      ),
    );

    const eventSource = new EventSource(
      backend == "" ? "https://localhost:7097/api/SSE" : backend,
    ); // THE SERVER

    // Each of these is responsible for listening to and storing one specific datapoint (as well as its metadata)
    // The data received from the server is as follows:
    // "'data'@{timestamp: 'timestamp', latitude 'latitude', longitude 'longitude'}"
    eventSource.addEventListener("altitude", (event) => {
      console.log("altitude");
      let metadata = JSON.parse(String(event.data.split("@")[1]));

      data.latitude = Number(metadata.latitude);
      data.longitude = Number(metadata.longitude);

      if (typeof data.altitude[0][0] != "string") {
        data.altitude[0] = [
          String(metadata["Timestamp"]),
          Number(event.data.split("@")[0]),
        ];
      } else {
        data.altitude.push([
          String(metadata["Timestamp"]),
          Number(event.data.split("@")[0]),
        ]);
      }
    });
    eventSource.addEventListener("temperature", (event) => {
      console.log("temp");
      let metadata = JSON.parse(event.data.split("@")[1]);
      data.latitude = Number(metadata.latitude);
      data.longitude = Number(metadata.longitude);

      if (typeof data.temperature[0][0] != "string") {
        data.temperature[0] = [
          String(metadata["Timestamp"]),
          Number(event.data.split("@")[0]),
        ];
      } else {
        data.temperature.push([
          String(metadata["Timestamp"]),
          Number(event.data.split("@")[0]),
        ]);
      }
    });
    eventSource.addEventListener("pressure", (event) => {
      let metadata = JSON.parse(event.data.split("@")[1]);
      data.latitude = Number(metadata.latitude);
      data.longitude = Number(metadata.longitude);

      if (typeof data.pressure[0][0] != "string") {
        data.pressure[0] = [
          String(metadata["Timestamp"]),
          Number(event.data.split("@")[0]),
        ];
      } else {
        data.pressure.push([
          String(metadata["Timestamp"]),
          Number(event.data.split("@")[0]),
        ]);
      }
    });
    eventSource.addEventListener("accelerationx", (event) => {
      let metadata = JSON.parse(event.data.split("@")[1]);
      data.latitude = Number(metadata.latitude);
      data.longitude = Number(metadata.longitude);

      if (typeof data.accelerationx[0][0] != "string") {
        data.accelerationx[0] = [
          String(metadata["Timestamp"]),
          Number(event.data.split("@")[0]),
        ];
      } else {
        data.accelerationx.push([
          String(metadata["Timestamp"]),
          Number(event.data.split("@")[0]),
        ]);
      }
    });
    eventSource.addEventListener("accelerationy", (event) => {
      let metadata = JSON.parse(event.data.split("@")[1]);
      data.latitude = Number(metadata.latitude);
      data.longitude = Number(metadata.longitude);

      if (typeof data.accelerationy[0][0] != "string") {
        data.accelerationy[0] = [
          String(metadata["Timestamp"]),
          Number(event.data.split("@")[0]),
        ];
      } else {
        data.accelerationy.push([
          String(metadata["Timestamp"]),
          Number(event.data.split("@")[0]),
        ]);
      }
    });
    eventSource.addEventListener("accelerationz", (event) => {
      let metadata = JSON.parse(event.data.split("@")[1]);
      data.latitude = Number(metadata.latitude);
      data.longitude = Number(metadata.longitude);

      if (typeof data.accelerationz[0][0] != "string") {
        data.accelerationz[0] = [
          String(metadata["Timestamp"]),
          Number(event.data.split("@")[0]),
        ];
      } else {
        data.accelerationz.push([
          String(metadata["Timestamp"]),
          Number(event.data.split("@")[0]),
        ]);
      }
    });
  });

  $: if (data == data) {
    console.log(data);
  }

  let state: States = States.RAW;

  function changeState(st: States) {
    state = st;
  }
</script>

<body>
  <nav
    style="height: 3rem;  width: 100%; background-color: #EFFEFE; display:flex; align-items: left;"
  >
    <img src={logo} alt="Orbisat Logo" style="height:3rem; width:auto" />
    <p class="name" style="margin: 0 0 0 10px;">Orbisat Oeiras</p>
  </nav>
  <div class="test-mode">
    <p>
      This dashboard is running on <span style="color: red"
        ><b>TEST MODE</b></span
      >.
    </p>
  </div>
  <div class="graphs-div">
    <div>
      <section>
        Pressure [Pa]
        <Chart
          labels={data.pressure.map((x) => String(x[0]))}
          datasets={[
            { label: "Altitude", data: data.pressure.map((x) => Number(x[1])) },
          ]}
          title={["Time[s]"]}
        />
      </section>
      <div class="data-visualizer">
        <span class="label" style="color:darkviolet">Pressure</span>
        <div class="data-container">
          <span class="value"
            >{data.pressure[data.pressure.length - 1]?.[1] ?? 0}</span
          >
          <span class="unit">Pa</span>
        </div>
      </div>
    </div>
    <div>
      <section>
        Temperature [ºC]
        <Chart
          labels={data.temperature.map((x) => String(x[0]))}
          datasets={[
            {
              label: "Temperature",
              data: data.temperature.map((x) => Number(x[1])),
            },
          ]}
          title={["Time [s]"]}
        />
      </section>
      <div class="data-visualizer">
        <span class="label" style="color:crimson">Temperature</span>
        <div class="data-container">
          <span class="value"
            >{data.temperature[data.temperature.length - 1]?.[1] ?? 0}</span
          >
          <span class="unit">ºC</span>
        </div>
      </div>
    </div>
    <div>
      <section>
        Altitude [m]
        <Chart
          labels={data.altitude.map((x) => String(x[0]))}
          datasets={[
            { label: "Altitude", data: data.altitude.map((x) => Number(x[1])) },
          ]}
          title={["Time [s]"]}
        />
      </section>
      <div class="data-visualizer">
        <span class="label" style="color:aqua;">Altitude</span>
        <div class="data-container">
          <span class="value"
            >{data.altitude[data.altitude.length - 1]?.[1] ?? 0}</span
          >
          <span class="unit">m</span>
        </div>
      </div>
    </div>
  </div>
  <div class="graphs-div">
    <div>
      <section>
        Acceleration [m/s²]
        <Chart
          labels={data.accelerationx.map((x) => String(x[0]))}
          datasets={[
            {
              label: "X",
              data: data.accelerationx.map((x) => Number(x[1])),
              borderColor: "red",
            },
            {
              label: "Y",
              data: data.accelerationy.map((x) => Number(x[1])),
              borderColor: "green",
            },
            {
              label: "Z",
              data: data.accelerationz.map((x) => Number(x[1])),
              borderColor: "blue",
            },
          ]}
          showLegends={true}
          title={["Time [s]"]}
        />
      </section>
    </div>
  </div>
</body>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap");
  :global(html, body) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    font-family: "Lato", sans-serif;
  }
  :global(body) {
    background-color: rgb(13, 14, 17);
    min-height: 100vh;
  }
  .graphs-div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    gap: 2rem;
  }
  .test-mode {
    display: flex;
    justify-content: center;
    background-color: rgb(25, 24, 30);
    color: white;
    text-align: center;
    font-family: "Lato", "Open Sans", sans-serif;
    font-size: 1.2rem;
    border-radius: 10px;
  }
  .name {
    font-size: 20px;
    color: black;
    font-family: "Lato", "Open Sans", sans-serif;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
  .data-visualizer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    background-color: #1a1b1e;
    margin-top: 20px;
    border-radius: 10px;
    padding: 1.5rem;
    width: 100%;
    box-sizing: border-box;
  }
  .label {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  .data-container {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }
  .value {
    font-size: 2rem;
    font-weight: bold;
    color: white;
  }
  .unit {
    font-size: 1.2rem;
    color: #888;
  }
  section {
    background-color: #1a1b1e;
    padding: 1rem;
    border-radius: 10px;
    color: white;
  }
</style>
