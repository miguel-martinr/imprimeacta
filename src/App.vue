<script setup lang="ts">
import { onMounted, onUnmounted, ref, provide } from 'vue';
import { RouterView } from 'vue-router';
const isNavVisible = ref(true);
const showLogin = ref(true);
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';

const isLoading = ref(false);
const withSpinner = async (fn: () => Promise<any>) => {
  let result: any = null;
  fn().then((res) => result = res).finally(() => isLoading.value = false);

  setTimeout(() => {
    if (result === null) {
      isLoading.value = true;
    }
  }, 500);

  return result;
};

provide('withSpinner', withSpinner);

let lastScrollPosition = 0;
const tolerance = 70;

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

function handleScroll() {
  const currentScrollPosition = window.scrollY;
  const isScrollingUp = currentScrollPosition < lastScrollPosition;

  if (isScrollingUp) {
    const scrollDifference = Math.abs(currentScrollPosition - lastScrollPosition);
    if (scrollDifference <= tolerance) {
      return;
    }
  }

  isNavVisible.value = isScrollingUp || currentScrollPosition <= 50;
  lastScrollPosition = currentScrollPosition;
  showLogin.value = currentScrollPosition < 50;
}
</script>

<template>
  <Toast />
  <header>
    <div class="wrapper">
      <div class="row navigation-links">
        <a class="logo-link" href="/">
          <img class="logo-img" src="@/assets/flag.png" alt="Imprime actas" /><span class="logo-text">Imprime
            actas</span>
        </a>
        <div class="spinner">
          <ProgressSpinner :style='{ width: "3rem", height: "3rem", opacity: Number(isLoading) }' strokeWidth="8"
            fill="transparent" animationDuration="0.9s" />
        </div>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<style lang="scss">
header {
  line-height: 1.5;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-image: linear-gradient(180deg, rgb(0 0 0 / 50%) -25%, rgba(9, 12, 121, 100) 100%);

  .logo-link {
    margin: 12px;

    .logo-img {
      max-width: 50px;
      margin-right: 8px;
      border-radius: 8px;
    }

    .logo-text {
      font-family: 'Oswald', sans-serif;
      color: white;
      font-weight: 900;
      font-size: calc(14px + 1vw);
      line-height: normal;
      vertical-align: middle;
      transition: text-shadow 0.2s ease;

      &:hover {
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.4), 0 0 10px rgba(255, 255, 255, 0.3), 0 0 15px rgba(255, 255, 255, 0.2);
        background-color: initial;
      }

      &:active {
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.4), 0 0 10px rgba(255, 255, 255, 0.3), 0 0 15px rgba(255, 255, 255, 0.2);
        background-color: initial;
      }
    }
  }
}

.wrapper {
  width: 100%;
}

.navigation-links {
  justify-content: space-between;

  .top-signup {
    display: flex;
    margin-right: 12px;
    color: #2997ff;
    padding: 8px 16px;
    border-radius: 16px;
    align-items: center;
    text-decoration: revert;
  }
}

.button-64 {
  align-items: center;
  background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
  border: 0;
  border-radius: 8px;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  box-sizing: border-box;
  color: #ffffff;
  display: flex;
  font-family: Phantomsans, sans-serif;
  font-size: 20px;
  justify-content: center;
  line-height: 1em;
  max-width: 100%;
  min-width: 140px;
  padding: 3px;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  cursor: pointer;
}

.button-64:active,
.button-64:hover {
  outline: 0;
}

.button-64 span {
  background-color: rgb(5, 6, 45);
  padding: 16px 24px;
  border-radius: 6px;
  width: 100%;
  height: 100%;
  transition: 300ms;
}

.button-64:hover span {
  background: none;
}

@media (min-width: 768px) {
  .button-64 {
    font-size: 24px;
    min-width: 196px;
  }
}

.p-toast {
  max-width: calc(100vw - 40px);
}

.spinner {
  padding-top: 1rem;
  padding-right: 1rem;
}
</style>
