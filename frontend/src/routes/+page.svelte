<script lang="ts">
  import Chart from "../lib/components/Chart.svelte";
</script>

<body>
  <div class="graphs">
    <section>
      <Chart labels={["1", "2", "3", "4"]} data={[5, 3, 7, 2]} />
    </section>
    <h1>Pressão</h1>
    <section>
      <Chart labels={["1", "2", "3", "4"]} data={[5, 3, 7, 2]} />
    </section>
    <h1>Temperatura</h1>
    <section>
      <Chart labels={["1", "2", "3", "4"]} data={[5, 3, 7, 2]} />
    </section>
    <h1>Altura</h1>
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
    color: rgb(215, 127, 43);
    font-family: "Open Sans", sans-serif;
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .graphs h1 {
    padding-top: 0px;
    margin-top: 0px;
  }
  .images {
    min-height: 100vh;
    float: right;
    width: 64%;
    background-color: rgb(53, 53, 54);
    color: rgb(231, 175, 111);
  }
</style>
