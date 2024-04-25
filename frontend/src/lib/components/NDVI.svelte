<script lang="ts">
    import { onMount } from 'svelte';
    import Hls from 'hls.js';
  
    let videoElement:HTMLVideoElement;
    const loadSource = 'http://192.168.1.156:8000/master.m3u8'
  
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
<video bind:this={videoElement} controls autoplay muted width="700"></video>
