<script>
  import { onMount } from "svelte";
  import { Button } from "sveltestrap";
  let showCircle = false;
  let expanded = false;
  let showText = false;
  let showSubtext = false;

  onMount(() => {
    showCircle = true;

    setTimeout(() => {
      expanded = true;
    }, 1900);

    setTimeout(() => {
      showText = true;

      setTimeout(() => {
        showSubtext = true;
      }, 1000);
    }, 3000);
  });
</script>

<div class="main">
  {#if showCircle}
    <div class="circle {expanded ? 'expanded' : 'initial'}"></div>
  {/if}
  <div class="text {showText ? 'show' : ''}" align="center">
    {#if showText}
      <div class="box">
        <div class="col">
          <hr />
        </div>
        <div class="col">
          <Button disabled block color="light">
            <h1 style="font-size: 3rem; color: #7f9bb8;">UE</h1>
          </Button>
        </div>
        <div class="col">
          <hr />
        </div>
      </div>
    {/if}
    {#if showSubtext}
      <h4 class="slide-up" style="color: #1751a9b1;">
        <i><b>U</b>niversal <b>E</b>ncryption</i>
      </h4>
    {/if}
  </div>
</div>

<style>
  .main {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #7f9bb8;
    color: white;
    font-size: 5vw;
  }

  .circle {
    background-color: white;
    border-radius: 50%;
    transition: all 2s ease-in;
    z-index: 1;
    animation: changeColor 2s ease-in forwards;
  }

  @keyframes changeColor {
    0% {
      opacity: 0;
    }
    30% {
      opacity: 0;
    }
    70% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  .circle.initial {
    width: 6vh;
    height: 6vh;
    border-radius: 50%;
  }

  .circle.expanded {
    width: 200vw;
    height: 200vw;
    animation: fixRadius 2s ease forwards;
  }

  @keyframes fixRadius {
    0%,
    80% {
      border-radius: 50%;
    }
    100% {
      border-radius: 0;
    }
  }

  .text {
    position: absolute;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.5s ease-in;
    color: black;
  }

  .text.show {
    opacity: 1;
  }

  .slide-up {
    margin-top: 2vh;
    opacity: 0;
    transform: translateY(6vh);
    animation: slideUp 0.6s ease-out forwards;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(6vh);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* btn line */
  .box {
    width: 80vw;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1vh;
  }

  .col {
    flex: 1;
    text-align: center;
  }
</style>
