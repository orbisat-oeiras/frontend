<script lang="ts">
  import Chart from "../lib/components/Chart.svelte";
  import Button from "../lib/components/Button.svelte";
  import RealTime from "$lib/components/RealTime.svelte";
  import { States } from "../types";
  import Ndvi from "$lib/components/NDVI.svelte";

  // This code is related to getting the data from the server.

  // The data is organized as a dictionary of datapoints. 
  // When applicable, these are devided as an array of arrays containing the time (String) followed by the data (Number).
 let data = {
      pressure: [["0", 0]], 
      altitude: [["0", 0]],
      temperature: [["0", 0]],
      latitude: 0,
      longitude: 0
  }
  const eventSource = new EventSource('https://localhost:7097/api/SSE') // THE SERVER

  // Each of these is responsible for listening to and storing one specific datapoint (as well as its metadata)
  // The data received from the server is as follows:
  // "'data'@{timestamp: 'timestamp', latitude 'latitude', longitude 'longitude'}"
  eventSource.addEventListener("primary/altitude", (event) => {
    let metadata = JSON.parse(event.data.split("@")[1])
    data.altitude.push([metadata.timestamp, Number(event.data.split("@")[0])]);
    data.latitude = Number(metadata.latitude)
    data.longitude = Number(metadata.longitude)
  })
  eventSource.addEventListener("primary/temperature", (event) => {
    let metadata = JSON.parse(event.data.split("@")[1])
    data.temperature.push([JSON.parse(event.data.split("@")[1]).timestamp, Number(event.data.split("@")[0])]);
    data.latitude = Number(metadata.latitude)
    data.longitude = Number(metadata.longitude)
  })
  eventSource.addEventListener("primary/pressure", (event) => {
    let metadata = JSON.parse(event.data.split("@")[1])
    data.pressure.push([JSON.parse(event.data.split("@")[1]).timestamp, Number(event.data.split("@")[0])]);
    data.latitude = Number(metadata.latitude)
    data.longitude = Number(metadata.longitude)
    console.log(data)
  })

  $: data = data;

  let state: States = States.NDVI;

  function changeState(st: States) {
    state = st;
  }

</script>

<body>
  <div class="graphs">
    <section>
      <Chart
        labels={data.pressure.map((x) => String(x[0]))} 
        data={data.pressure.map((x) => Number(x[1]))}
        title={["Pressão"]}
        unit="Pa"
      />
    </section>
    <section>
      <Chart
        labels={data.temperature.map((x) => String(x[0]))}
        data={data.temperature.map((x) => Number(x[1]))}
        title={["Temperatura"]}
        unit="ºC"
      />
    </section>
    <section>
      <Chart
        labels={data.altitude.map((x) => String(x[0]))}
        data={data.altitude.map((x) => Number(x[1]))}
        title={["Altura"]}
        unit="m"
      />
    </section>
  </div>

  <div class="right-side">
    <div class="real-time" style="transform: translate({state == States.NDVI ? "-30%" : "0%"})">
      <RealTime state={state} latitude={data.latitude} longitude={data.longitude}> </RealTime>
    </div>
    <div class="buttons">
      <Button text="NDVI" on:click={() => changeState(States.NDVI)}></Button>
      <Button text="GPS" on:click={() => changeState(States.GPS)}></Button>
      <Button text="ACL" on:click={() => changeState(States.ACL)}></Button>
      <Button text="LOG" on:click={() => changeState(States.LOG)}></Button>
      </div>
  </div>
</body>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap");
  body {
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    min-width: fit-content;
  }
  .graphs {
    float: left;
    width: 30%;
    margin-right: 3%;
    margin-left: 3%;
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .right-side {
    min-height: 100vh;
    float: right;
    width: 64%;
    background-color: rgb(53, 53, 54);
    color: rgb(231, 175, 111);
  }
  .real-time {
    position: relative;
    display: block;
    margin-left: auto;
    margin-right: auto;
    padding-top: 70px;
    width: 50%;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .buttons {
    width: 480px;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0px;
    padding-top: 0;
  }
</style>
