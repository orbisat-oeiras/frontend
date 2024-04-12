<script lang="ts">
  import Chart from "../lib/components/Chart.svelte";
  import Button from "../lib/components/Button.svelte";
  import { onMount } from "svelte";

 let data = {
      time: ["0"], 
      pressure: ["0"], 
      altitude: ["0"],
      temperature: ["0"]
  }
const eventSource = new EventSource('https://localhost:7097/api/SSE')
eventSource.addEventListener("primary/altitude", (event) => {
    data.time.push(String(Number(data.time[data.time.length-1])+1));
    data.altitude.push(event.data.split("@")[0]);
})
eventSource.addEventListener("primary/temperature", (event) => {
    data.temperature.push(event.data.split("@")[0]);
})
eventSource.addEventListener("primary/pressure", (event) => {
    data.pressure.push(event.data.split("@")[0]);
    console.log(data)
})

console.log(data);

</script>

<body>
  <div class="graphs">
    <section>
      <Chart
        labels={data.time}
        data={[1000, 990, 950, 900, 910, 920, 925, 930, 940, 950]}
        title={["Pressão"]}
      />
    </section>
    <section>
      <Chart
        labels={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
        data={[30, 31, 29, 28, 27, 26.5, 26, 25, 25, 24]}
        title={["Temperatura"]}
      />
    </section>
    <section>
      <Chart
        labels={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
        data={[0, 400, 980, 910, 805, 703, 605, 508, 401, 302]}
        title={["Altura"]}
      />
    </section>
  </div>

  <div class="images">
    <img src="green.JPG" alt="green" height=400px class="center">
      <div class="buttons">
        <Button text="NDVI"></Button>
        <Button text="GPS"></Button>
        <Button text="ACL"></Button>
        <Button text="LOG"></Button>
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
  .images {
    min-height: 100vh;
    float: right;
    width: 64%;
    background-color: rgb(53, 53, 54);
    color: rgb(231, 175, 111);
  }
  .center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-top: 30px;
  width: 50%;
}
</style>
