<template>
  <main>
    <div class="main-container">
      <div class="instructions">
        <h1 class="title">Imprime el acta<br /></h1>

        <div class="buttons-wrapper">
          <router-link to="/buscar-acta" class="maduro-coño-e-tu-madre">
            <button class="search-button">
              Busca tu acta
            </button>
          </router-link>

          <span>o</span>

          <div class="upload-wrapper">
            <label class="maduro-coño-e-tu-madre" for="acta">Cárgala para imprimir</label>
            <input v-show="false" id="acta" type="file" class="maduro-coño-e-tu-madre" @change="handleFileUpload"
              accept="image/*" />
          </div>
          <div class="">
            ¿Quieres ver leer el contenido del código QR? visita
            <a href="https://lectorqreleccionesvzla2024.com">lectorqreleccionesvzla2024.com</a>
          </div>
        </div>

        <canvas v-show="false" ref="canvas" id="canvas"></canvas>
        <canvas v-show="false" class="acta-to-print" width="1312" height="884" ref="canvasResult" id="canvaresult" />
        <div>
          <a v-show="false" ref="linkToDownloadActaRef" href="" class="maduro-coño-e-tu-madre">Descargar Acta</a>
        </div>
        <img ref="imageActaResult" src="" />
        <br>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { processImage } from '@/utils/images';

const canvas = ref<any>({});
const canvasResult = ref<any>({});
const imageActaResult = ref<any>({});
const linkToDownloadActaRef = ref<any>({});

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const img = new Image();
    img.onload = () => {
      processImage(canvas, canvasResult, img, imageActaResult, linkToDownloadActaRef);
    };

    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}
</script>
<style scoped lang="scss">
.title {
  color: #fffbfb;
  display: block;
  font-size: 34pt;
  font-weight: bolder;
  line-height: 0.9;
  width: fit-content;
  padding: 8px 0px;
  margin: 16px 0;
  border-radius: 8px;
  text-decoration: none;

  &:hover {
    background-color: transparent;
  }
}

.white-text {
  color: rgb(255, 255, 255);
  text-shadow: 0 0 1px #000000c4;
  font-weight: bold;
  padding: 4px 0;
  margin: 0 12px 15px 12px;
}

.instructions {
  width: auto;
  margin: auto;
  padding: 0px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.main-container {
  height: 100%;
  padding-top: 74px;
}

.scann-qrcode {
  max-width: 250px;
  max-height: 250px;
}

.qrcode {
  word-break: break-all;
}

.maduro-coño-e-tu-madre {
  background: #00804d;
  border-radius: 4px;
  border: transparent;
  padding: 8px 16px;
  color: white;
  box-shadow: 0 0 6px -1px black;
  font-weight: bold;
  // margin: 10px 0px 36px 0px;
  cursor: pointer;
  display: inline-block;
}

.acta-to-print {
  width: 100%;
}

.search-button {
  color: white;
  background: inherit;
  border: none;
  text-decoration: none;
  font-weight: bold;
  font-size: 20px;
}

.upload-wrapper * {
  width: 100%;
}

.buttons-wrapper {
  display: flex;
  flex-direction: column;
}

.buttons-wrapper * {
  height: 4rem;
  text-align: center;
  align-content: center;
}
</style>
