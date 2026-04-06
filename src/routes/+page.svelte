<script lang="ts">
  import Chart from "../lib/components/Chart.svelte";
  import { States } from "../types";
  import { onMount } from "svelte";
  import logo from "$lib/images/OrbisatLogo.png";
  import RealTime from "../lib/components/RealTime.svelte";
  import { sendPacketsFromCode } from "$lib/components/SendPackets";
  import packetsJson from "$lib/packets.json";

  // This code is related to getting the data from the server.

  // The data is organized as an array of tuples containing the time (Number) followed by the data (Number).
  type Datapoint = [number, number][]; // Array of [time, value] pairs
  type Data = {
    pressure: Datapoint;
    altitude: Datapoint;
    temperature: Datapoint;
    humidity: Datapoint;
    accelerationx: Datapoint;
    accelerationy: Datapoint;
    accelerationz: Datapoint;
    system: Datapoint;
    latitude: number;
    longitude: number;
  };
  let data: Data = {
    pressure: [],
    altitude: [],
    temperature: [],
    humidity: [],
    accelerationx: [],
    accelerationy: [],
    accelerationz: [],
    system: [],
    latitude: 0,
    longitude: 0,
  };

  function roundNumber(number: number, digits: number) {
    var multiple = Math.pow(10, digits);
    var rndedNum = Math.round(number * multiple) / multiple;
    return rndedNum;
  }
  var gpsdataArray: string[];
  let currentTimestamp: number;
  let packetTimeDelayAltitude: number | null = null;
  let packetTimeDelayPressure: number | null = null;
  let packetTimeDelayTemperature: number | null = null;
  let packetTimeDelayHumidity: number | null = null;

  let lastAltitudeTimestamp: number | null = null;
  let lastTemperatureTimestamp: number | null = null;
  let lastHumidityTimestamp: number | null = null;
  let lastPressureTimestamp: number | null = null;

  let rawTimestamp = 0;

  gpsdataArray = [];

  onMount(async () => {
    var backend = String(
      prompt(
        "Insert the server (default is https://localhost:7097/api/SSE) - ",
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

      data.latitude = Number(metadata.Coordinates.Latitude);
      data.longitude = Number(metadata.Coordinates.Longitude);

      rawTimestamp = Number(metadata.Timestamp);

      currentTimestamp = Number(metadata.Timestamp) / 1e3; // Turn it to milliseconds

      if (lastAltitudeTimestamp !== null) {
        packetTimeDelayAltitude = currentTimestamp - lastAltitudeTimestamp;
        console.log(
          `Packet Time Delay Altitude: ${packetTimeDelayAltitude} milliseconds`,
        );
        if (packetTimeDelayAltitude > 600) {
          // If it's older than 600 milliseconds
          var amountofPacketsToFill = Math.floor(packetTimeDelayAltitude / 500);
          for (let i = 1; i <= amountofPacketsToFill; i++) {
            let missingTimestamp = lastAltitudeTimestamp + i * 500;
            if (missingTimestamp < currentTimestamp) {
              data.altitude = [
                ...data.altitude,
                [missingTimestamp, NaN] as [number, number],
              ].slice(-170);
            }
          }
        }
      }
      lastAltitudeTimestamp = currentTimestamp;

      gpsdataArray = [
        ...gpsdataArray,
        `Latitude: ${data.latitude}, Longitude: ${data.longitude}, Timestamp: ${currentTimestamp}`,
      ].slice(-500);

      data.altitude = [
        ...data.altitude,
        [currentTimestamp, Number(event.data.split("@")[0])] as [
          number,
          number,
        ],
      ].slice(-170);
    });
    eventSource.addEventListener("temperature", (event) => {
      console.log("temperature");
      let metadata = JSON.parse(String(event.data.split("@")[1]));

      currentTimestamp = Number(metadata.Timestamp) / 1e3;

      if (lastTemperatureTimestamp !== null) {
        packetTimeDelayTemperature =
          currentTimestamp - lastTemperatureTimestamp;
        console.log(
          `Packet Time Delay Temperature: ${packetTimeDelayTemperature} milliseconds`,
        );
        if (packetTimeDelayTemperature > 600) {
          var amountofPacketsToFill = Math.floor(
            packetTimeDelayTemperature / 500,
          );
          for (let i = 1; i <= amountofPacketsToFill; i++) {
            let missingTimestamp = lastTemperatureTimestamp + i * 500;
            if (missingTimestamp < currentTimestamp) {
              data.temperature = [
                ...data.temperature,
                [missingTimestamp, NaN] as [number, number],
              ].slice(-170);
            }
          }
        }
      }
      lastTemperatureTimestamp = currentTimestamp;

      data.temperature = [
        ...data.temperature,
        [currentTimestamp, Number(event.data.split("@")[0])] as [
          number,
          number,
        ],
      ].slice(-170);
    });
    eventSource.addEventListener("pressure", (event) => {
      console.log("pressure");
      let metadata = JSON.parse(String(event.data.split("@")[1]));

      currentTimestamp = Number(metadata.Timestamp) / 1e3;

      if (lastPressureTimestamp !== null) {
        packetTimeDelayPressure = currentTimestamp - lastPressureTimestamp;
        console.log(
          `Packet Time Delay Pressure: ${packetTimeDelayPressure} milliseconds`,
        );
        if (packetTimeDelayPressure > 600) {
          var amountofPacketsToFill = Math.floor(packetTimeDelayPressure / 500);
          for (let i = 1; i <= amountofPacketsToFill; i++) {
            let missingTimestamp = lastPressureTimestamp + i * 500;
            if (missingTimestamp < currentTimestamp) {
              data.pressure = [
                ...data.pressure,
                [missingTimestamp, NaN] as [number, number],
              ].slice(-170);
            }
          }
        }
      }
      lastPressureTimestamp = currentTimestamp;

      data.pressure = [
        ...data.pressure,
        [currentTimestamp, Number(event.data.split("@")[0])] as [
          number,
          number,
        ],
      ].slice(-170);
    });
    eventSource.addEventListener("humidity", (event) => {
      console.log("humidity");
      let metadata = JSON.parse(String(event.data.split("@")[1]));

      currentTimestamp = Number(metadata.Timestamp) / 1e3;

      if (lastHumidityTimestamp !== null) {
        packetTimeDelayHumidity = currentTimestamp - lastHumidityTimestamp;
        console.log(
          `Packet Time Delay Humidity: ${packetTimeDelayHumidity} seconds`,
        );
        if (packetTimeDelayHumidity > 600) {
          var amountofPacketsToFill = Math.floor(packetTimeDelayHumidity / 500);
          for (let i = 1; i <= amountofPacketsToFill; i++) {
            let missingTimestamp = lastHumidityTimestamp + i * 500;
            if (missingTimestamp < currentTimestamp) {
              data.humidity = [
                ...data.humidity,
                [missingTimestamp, NaN] as [number, number],
              ].slice(-170);
            }
          }
        }
      }
      lastHumidityTimestamp = currentTimestamp;

      data.humidity = [
        ...data.humidity,
        [currentTimestamp, Number(event.data.split("@")[0])] as [
          number,
          number,
        ],
      ].slice(-170);
    });
    eventSource.addEventListener("system", (event) => {
      let metadata = JSON.parse(event.data.split("@")[1]);
      console.log("System Event:", metadata);
      data.system = [
        ...data.system,
        [Number(metadata.Timestamp), metadata["Value"]],
      ];
    });
  });

  let currentPage: string = "home";
  function updatePage() {
    currentPage = window.location.hash.replace("#", "") || "home";
  }

  let packetSentResponse: string = "";
  let selectedCode = "";
  let packetText = "";
  const packets = [
    { code: "1", name: "Ping" },
    { code: "2", name: "Hello World" },
    { code: "3", name: "Synchronize time" },
    { code: "32", name: "Custom Packet" },
  ];
  const endpoint = "https://localhost:7097/api/PostPacket";
  $: if (selectedCode !== "32") {
    packetText =
      JSON.stringify(
        packetsJson.find((p) => p.code === selectedCode)?.packet,
        null,
        2,
      ) ?? "";
  }

  async function sendPackets() {
    try {
      const timestamp = BigInt(Date.now() * 1000);
      const response = await sendPacketsFromCode(
        packetText,
        endpoint,
        timestamp,
      );
      if (response) {
        packetSentResponse = `Packet sent successfully! Server response: ${response.status} ${response.statusText}`;
      }
      if (!response) {
        alert("Failed to send packet.");
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.includes("Load failed")) {
          packetSentResponse = "Error: Unable to reach server.";
        } else packetSentResponse = `Error: ${e.message}`;
      } else {
        packetSentResponse = "An unknown error occurred.";
      }
    }
  }
  let gpsTextArea: HTMLTextAreaElement;
  $: {
    gpsdataArray;
    if (gpsTextArea) {
      const isNearBottom =
        gpsTextArea.scrollHeight -
          gpsTextArea.scrollTop -
          gpsTextArea.clientHeight <
        50;
      if (isNearBottom) {
        // Stop autoscroll if user has scrolled up
        gpsTextArea.scrollTop = gpsTextArea.scrollHeight;
      }
    }
  }
</script>

<svelte:window on:hashchange={updatePage} />
<body>
  <nav
    style="height: 3rem;  width: 100%; background-color: #EFFEFE; display:flex; align-items: left;"
  >
    <img src={logo} alt="Orbisat Logo" style="height:3rem; width:auto" />
    <p class="name" style="margin: 0 0 0 10px;">Orbisat Oeiras</p>
    <button
      on:click={() => {
        window.location.hash = "home";
        currentPage = "home";
      }}
      class="switch-page">Main Page</button
    >
    <button
      on:click={() => {
        window.location.hash = "sensorStatus";
        currentPage = "sensorStatus";
      }}
      class="switch-page">Sensor Status</button
    >
    <button
      on:click={() => {
        window.location.hash = "liveMap";
        currentPage = "liveMap";
      }}
      class="switch-page">Live Map</button
    >
    <button
      on:click={() => {
        window.location.hash = "sendTc";
        currentPage = "sendTc";
      }}
      class="switch-page">Send TC</button
    >
  </nav>
  {#if currentPage === "home"}
    <div class="dashboard">
      <div class="graphs-container">
        <div class="graphs-div">
          <div>
            <section>
              Pressure [Pa]
              <Chart
                labels={data.pressure.map((x) => Number(x[0]))}
                datasets={[
                  {
                    label: "Altitude",
                    data: data.pressure.map((x) => Number(x[1])),
                  },
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
              Altitude [m]
              <Chart
                labels={data.altitude.map((x) => Number(x[0]))}
                datasets={[
                  {
                    label: "Altitude",
                    data: data.altitude.map((x) => Number(x[1])),
                  },
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
              Temperature [ºC]
              <Chart
                labels={data.temperature.map((x) => Number(x[0]))}
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
                  >{data.temperature[data.temperature.length - 1]?.[1] ??
                    0}</span
                >
                <span class="unit">ºC</span>
              </div>
            </div>
          </div>
          <div>
            <section>
              Humidity [%]
              <Chart
                labels={data.humidity.map((x) => Number(x[0]))}
                datasets={[
                  {
                    label: "Humidity",
                    data: data.humidity.map((x) => Number(x[1])),
                  },
                ]}
                title={["Time [s]"]}
              />
            </section>
            <div class="data-visualizer">
              <span class="label" style="color:aqua;">Humidity</span>
              <div class="data-container">
                <span class="value"
                  >{data.humidity[data.humidity.length - 1]?.[1] ?? 0}</span
                >
                <span class="unit">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="real-time">
        <RealTime
          state={States.GPS}
          latitude={data.latitude}
          longitude={data.longitude}
          timestamp={parseFloat(
            String(data.altitude[data.altitude.length - 1]?.[0] ?? 0),
          ).toFixed(2)}
        ></RealTime>
        <div class="real-time-bottom">
          <!-- <textarea class="gps-data" readonly
            >{gpsdataArray.join("\n")}</textarea
          > -->

          <div class="data-visualizer">
            <span class="label" style="color:crimson">Current Timestamp</span>
            <div class="data-container">
              <span class="value">{rawTimestamp}</span>
              <span class="unit">µs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else if currentPage === "sensorStatus"}
    <h1 style="color:white; margin:2rem; text-align: center;">Sensor Status</h1>
    <div class="status-container">
      <div class="status-visualizer">
        <span class="label" style="color:cadetblue;">
          BME280 (Pressure, Temperature, Humidity)
        </span>
        <div class="data-container">
          <span class="value" style="color:lightgreen">Connected</span>
        </div>
      </div>
    </div>
  {:else if currentPage === "liveMap"}
    <div class="livemap">
      <textarea bind:this={gpsTextArea} class="gps-data" readonly
        >{gpsdataArray.join("\n")}</textarea
      >
      <RealTime
        state={States.GPS}
        latitude={data.latitude}
        longitude={data.longitude}
        timestamp={parseFloat(
          String(data.altitude[data.altitude.length - 1]?.[0] ?? 0),
        ).toFixed(2)}
        height="70vh"
        width="100%"
      ></RealTime>
    </div>
  {:else if currentPage === "sendTc"}
    <h1 style="color:white; margin:2rem;">Send TC Page</h1>
    <div class="tcpage">
      <textarea
        class="editor"
        bind:value={packetText}
        rows="15"
        cols="75"
        on:input={() => {
          selectedCode = "32";
        }}
      ></textarea>
      <div class="tcselector">
        <select
          bind:value={selectedCode}
          style="width: 200px; height: 30px; font-family: 'Lato', sans-serif; font-size: 16px;"
        >
          <option value="" disabled>Select a packet</option>
          {#each packets as p}
            <option value={p.code}>{p.code} - {p.name}</option>
          {/each}
        </select>
        <button
          on:click={sendPackets}
          class="switch-page"
          style="background-color: #4eff47 !important">Send Packet</button
        >
        <span class="value" style="font-size: 1.5rem">{packetSentResponse}</span
        >
      </div>
    </div>
  {/if}
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
    justify-content: left;
    padding: 0.5rem;
    gap: 2rem;
    height: auto;
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
  .real-time {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .gps-data {
    width: 30vw;
    height: 60vh;
    background-color: #1a1b1e;
    color: white;
    border-radius: 10px;
    font-family: "Lato", sans-serif;
    font-size: 0.9rem;
    padding: 1rem;
    border: none;
    resize: none;
    white-space: pre;
    overflow-y: auto;
  }

  .graphs-container {
    display: flex;
    flex-direction: column;
  }
  .dashboard {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 2rem;
    padding: 2rem;
    box-sizing: border-box;
    width: 100%;
  }
  .real-time-bottom {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: left;
    align-items: left;
    width: 100%;
  }
  .switch-page {
    margin-left: 2rem;
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .status-container {
    margin-top: 2rem;
    display: flex;
    align-items: left;
    justify-content: left;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
  }
  .status-visualizer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: #1a1b1e;
    border-radius: 10px;
    padding: 1.5rem;
    width: 20%;
    height: 30rem;
    box-sizing: border-box;
  }
  .editor {
    background-color: #1a1b1e;
    border-width: 0;
    border-radius: 10px;
    color: white;
    font-family: monospace;
    font-size: 2rem;
  }
  .tcpage {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  .tcselector {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    max-width: 300px;
    text-align: center;
  }
  .livemap {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    padding: 2rem;
  }
</style>
