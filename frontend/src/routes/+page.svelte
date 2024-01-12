<script lang="ts">
  import Chart from "../lib/components/Chart.svelte";
  // This code is related to getting the data. It is still not working, so I left it commented.
  /*
  import { writable } from "svelte/store";
  const data = writable([]);

  const evtSource = new EventSource("api");

  evtSource.onmessage = function (event) {
    var dataobj = JSON.parse(event.data);
    data.update((arr) => arr.concat(dataobj));
  };
  */
</script>

<body>
  <div class="graphs">
    <section>
      <Chart
        labels={["1", "2", "3", "4"]}
        data={[5, 3, 7, 2]}
        title={["Pressão"]}
      />
    </section>
    <section>
      <Chart
        labels={["1", "2", "3", "4"]}
        data={[5, 3, 7, 2]}
        title={["Temperatura"]}
      />
    </section>
    <section>
      <Chart
        labels={["1", "2", "3", "4"]}
        data={[5, 3, 7, 2]}
        title={["Altura"]}
      />
    </section>
  </div>

  <div class="images">
    <h1>images go here</h1>
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
</style>
