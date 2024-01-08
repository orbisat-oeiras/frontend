<script lang="ts">
  import Chart from "../lib/components/Chart.svelte";
</script>

<main>
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
</main>

<style>
  main {
    min-height: 100vh;
    margin: 0 auto;
    padding: 0 20px;
  }
  .graphs {
    float: left;
    width: 28%;
    margin-right: 1.5%;
    margin-left: 0.5%;
    color: rgb(215, 127, 43);
  }
  .graphs h1 {
    padding-top: 0px;
    margin-top: 0px;
  }
  .images {
    min-height: 100vh;
    float: right;
    width: 70%;
    background-color: rgb(53, 53, 54);
    color: rgb(231, 175, 111);
  }
</style>
