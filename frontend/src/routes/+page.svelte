<script lang="ts">
  import Chart from "../lib/components/Chart.svelte";
  import Button from "../lib/components/Button.svelte";
  import RealTime from "$lib/components/RealTime.svelte";
  import { States } from "../types";
  import { onMount } from "svelte";

  // This code is related to getting the data from the server.

  // The data is organized as a dictionary of datapoints. 
  // When applicable, these are devided as an array of arrays containing the time (String) followed by the data (Number).
  type Datapoint = [[string | undefined, Number | undefined]]
  type Data = {
    pressure: Datapoint
    altitude: Datapoint
    temperature: Datapoint
    latitude: number
    longitude: number
  }
 let data: Data = {
  pressure: [[undefined, undefined]], 
  altitude: [[undefined, undefined]], 
  temperature: [[undefined, undefined]], 
  latitude: 0, 
  longitude: 0}
  var backend: string = ""
  var videoSource: string = ""
  onMount(async() => {
    var backend = String(prompt("Insert the server (default is https://localhost:7097/api/SSE) - "))
    var videoSource = String(prompt("Insert the video source (default is http://localhost:8000/master.m3u8) - "))

    const eventSource = new EventSource(backend == "" ? 'https://localhost:7097/api/SSE' : backend) // THE SERVER


    // Each of these is responsible for listening to and storing one specific datapoint (as well as its metadata)
    // The data received from the server is as follows:
    // "'data'@{timestamp: 'timestamp', latitude 'latitude', longitude 'longitude'}"
    eventSource.addEventListener("primary/altitude", (event) => {
      console.log("altitude")
      let metadata = JSON.parse(String(event.data.split("@")[1]))

      data.latitude = Number(metadata.latitude)
      data.longitude = Number(metadata.longitude)

      if (typeof(data.altitude[0][0]) != "string") {
        data.altitude[0] = [String(metadata["Timestamp"]), Number(event.data.split("@")[0])]
      } else {
        data.altitude.push([String(metadata["Timestamp"]), Number(event.data.split("@")[0])]);
      }
    })
    eventSource.addEventListener("primary/temperature", (event) => {
      console.log("temp")
      let metadata = JSON.parse(event.data.split("@")[1])
      data.latitude = Number(metadata.latitude)
      data.longitude = Number(metadata.longitude)

      if (typeof(data.temperature[0][0]) != "string") {
        data.temperature[0] = [String(metadata["Timestamp"]), Number(event.data.split("@")[0])]
      } else {
        data.temperature.push([String(metadata["Timestamp"]), Number(event.data.split("@")[0])]);
      }
  })
  eventSource.addEventListener("primary/pressure", (event) => {
    let metadata = JSON.parse(event.data.split("@")[1])
    data.latitude = Number(metadata.latitude)
    data.longitude = Number(metadata.longitude)

    if (typeof(data.pressure[0][0]) != "string") {
      data.pressure[0] = [String(metadata["Timestamp"]), Number(event.data.split("@")[0])]
    } else {
      data.pressure.push([String(metadata["Timestamp"]), Number(event.data.split("@")[0])]);
    }
  })
  })

  $: if (data == data){
    console.log(data)
  }

  let state: States = States.RAW;

  function changeState(st: States) {
    state = st;
  }

</script>

<body>
  <div class="graphs">
    <section>
      Pressure [Pa]
      {#key data.pressure}
        <Chart
          labels={data.pressure.map((x) => String(x[0]))} 
          data={data.pressure.map((x) => Number(x[1]))}
          title={["Time[s]"]}
          unit=""
        />
      {/key}
    </section>
    <section>
      Temperature [ºC]
      {#key data.temperature}
        <Chart
          labels={data.temperature.map((x) => String(x[0]))}
          data={data.temperature.map((x) => Number(x[1]))}
          title={["Time [s]"]}
          unit=""
        />
      {/key}
    </section>
    <section>
      Height [m]
      {#key data.altitude}
        <Chart
          labels={data.altitude.map((x) => String(x[0]))}
          data={data.altitude.map((x) => Number(x[1]))}
          title={["Time [s]"]}
          unit=""
        />
      {/key}
    </section>
  </div>

  <div class="right-side">
    <!-- style="transform: translate({state == States.NDVI ? "-30%" : "0%"})" -->
    <div class="real-time" >
      <RealTime state={state} latitude={data.latitude} longitude={data.longitude} videoSource={videoSource}> </RealTime>
    </div>
    <div class="buttons">
      <Button text="VIDEO" on:click={() => changeState(States.RAW)} isClicked={state == States.RAW}></Button>
      <Button text="GPS" on:click={() => changeState(States.GPS)} isClicked={state == States.GPS}></Button>
      <Button text="NDVI" on:click={() => changeState(States.NDVI)} isClicked={state == States.NDVI}></Button>
      </div>
  </div>
</body>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap");
  body {
    height: 100%;
    overflow: hidden;
    overflow-y: hidden;
    margin: 0;
    padding: 0;
    min-width: fit-content;
  }
  .graphs {
    float: left;
    width: 30%;
    margin-right: 3%;
    margin-left: 3%;
    margin-top: 1%;
    margin-bottom: 2%;
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    color:rgb(231, 175, 111);
  }
  .right-side {
    min-height:110vh;
    float: right;
    width: 64%;
    background-color: rgb(53, 53, 54);
    color: rgb(231, 175, 111);
    size: 15;
  }
  .real-time {
    position: relative;
    display: block;
    margin-left: auto;
    margin-right: auto;
    padding-top: 70px;
    margin-bottom: 0;
    padding-bottom: 0;
    width: 57%;
    top: 15vh;
  }
  .buttons {
    width: 390px;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    margin-top: 17vh;
    padding-top: 0;
  }
</style>
