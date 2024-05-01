<script lang="ts">
    import { onMount } from 'svelte';
    import Hls from 'hls.js';
  
    let videoElement:HTMLVideoElement;
    export let videoSource: string;
    const loadSource = (videoSource == "" ? String('http://192.168.1.156:8000/master.m3u8') : videoSource)
  
    onMount(async () => {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(loadSource);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play();
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = loadSource; // Fallback for Safari
        videoElement.addEventListener('loadedmetadata', () => {
          videoElement.play();
        });
      }
    });
  </script>
<div >
  <video bind:this={videoElement} controls autoplay muted></video>
</div>
<style>
  video {
    width: 45vw;
    margin-left: -50%;
  }
</style>
