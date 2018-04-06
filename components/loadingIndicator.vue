<template>
  <div class="spinner">
    <div class="rect1"/>
    <div class="rect2"/>
    <div class="rect3"/>
    <div class="rect4"/>
    <div class="rect5"/>
  </div>
</template>

<style>
.spinner {
  width: 50px;
  height: 40px;
  text-align: center;
}

.spinner > div {
  background-color: gray(35);
  height: 100%;
  width: 6px;
  display: inline-block;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  animation-delay: -1.1s;
}

.spinner .rect3 {
  animation-delay: -1s;
}

.spinner .rect4 {
  animation-delay: -0.9s;
}

.spinner .rect5 {
  animation-delay: -0.8s;
}

@keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}
</style>
