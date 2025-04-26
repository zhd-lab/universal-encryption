<script>
  import { onMount } from "svelte";

  import Intro from "./Intro.svelte";
  import Pannel from "./Pannel.svelte";

  import { state } from "../stores/stateStore";
  import Generator from "./Generator.svelte";
  import Decryptor from "./Decryptor.svelte";

  let intro = false;

  onMount(() => {
    setTimeout(() => {
      state.set("pannel");
      console.log(state);
    }, 7000);
  });
</script>

{#if $state === "intro"}
  <Intro />
{:else if $state === "pannel"}
  <Pannel />

  <!-- generator & decryptor sub comp -->
{:else if $state === "generator"}
  <Generator />
{:else if $state === "decryptor"}
  <Decryptor />
{/if}

<style>
</style>
