<template>
  <main>
    <div class="main-container">
      <div class="instructions">
        <h1 class="title">Encuentra tu acta<br /></h1>

        <div class="state-input-container">
          <label for="state" class="white-text">Estado</label>
          <AutoComplete v-model="selectedState" dropdown :suggestions="states" @complete="searchState" inputId="state"
            v-on:item-select="handleStateSelection" optionLabel="name" />
        </div>

        <div v-if="shouldShowMunicipalityInput" class="municipality-input-container">
          <label for="municipality" class="white-text">Municipio</label>
          <AutoComplete v-model="selectedMunicipality" dropdown :suggestions="municipalities"
            @complete="searchMunicipality" inputId="municipality" optionLabel="name"
            v-on:item-select="handleMunicipalitySelection" />
        </div>

        <div v-if="shouldShowParishInput" class="parish-input-container">
          <label for="parish" class="white-text">Parroquia</label>
          <AutoComplete v-model="selectedParish" dropdown :suggestions="parishes" @complete="searchParish"
            inputId="parish" optionLabel="name" v-on:item-select="handleParishSelection" />
        </div>

        <div v-if="shouldShowCenterInput" class="center-input-container">
          <label for="center" class="white-text">Centro</label>
          <AutoComplete v-model="selectedCenter" dropdown :suggestions="centers" @complete="searchCenter"
            inputId="center" optionLabel="name" v-on:item-select="handleCenterSelection" />
        </div>

        <div v-if="shouldShowTableInput" class="table-input-container">
          <label class="white-text">Mesa</label>
          <!-- v-for -->
          <div class="tables-container">
            <div v-for="table in tables" :key="table.code" class="table-card">
              <button @click="handleTableSelection(table)" class="table-button">
                {{ table.code }}
              </button>
            </div>
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
import AutoComplete from 'primevue/autocomplete';
import { getApi } from '@/api';
import type { State, Municipality, Parish, Center, Table } from '@/api/types';
import { useToast } from 'primevue/usetoast';
import { inject } from 'vue';
import { processImage, getBase64Image } from '@/utils/images';

const state: {
  states: State[],
  municipalities: Municipality[],
  parishes: Parish[],
  centers: Center[],
} = { states: [], municipalities: [], parishes: [], centers: [] };

const tables = ref<Table[]>([]);

const withSpinner = inject('withSpinner') as (fn: CallableFunction) => Promise<any>;

const fetchStates = async () => {
  getApi().getStates().then((fetchedStates) => {
    state.states = fetchedStates;
  }).catch((error) => {
    showError(`No se han podido recuperar los estados: ${error.message}`);
  });
}

const fetchMunicipalities = async () => {
  if (!selectedState.value) {
    return;
  }
  try {
    state.municipalities = await getApi().getMunicipalitiesForState(selectedState.value.code);
  } catch (error: any) {
    showError(`No se han podido recuperar los municipios: ${error.message}`);
  }
}

const fetchParishes = async () => {
  if (!selectedState.value || !selectedMunicipality.value) {
    return;
  }
  try {
    state.parishes = await getApi().getParishes(selectedState.value.code, selectedMunicipality.value.code);
  } catch (error: any) {
    showError(`No se han podido recuperar las parroquias: ${error.message}`);
  }
}

const fetchCenters = async () => {
  if (!selectedParish.value) {
    return;
  }
  try {
    state.centers = await getApi().getCentersForParish(selectedParish.value.code);
  } catch (error: any) {
    showError(`No se han podido recuperar los centros: ${error.message}`);
  }
}

const fetchTables = async () => {
  if (!selectedCenter.value) {
    return;
  }
  try {
    tables.value = await getApi().getTablesForCenter(selectedCenter.value.code);
  } catch (error: any) {
    showError(`No se han podido recuperar las mesas: ${error.message}`);
  }
}

withSpinner(fetchStates);

const toast = useToast();

const selectedState = ref<State | null>(null);
const selectedMunicipality = ref<Municipality | null>(null);
const selectedParish = ref<Parish | null>(null);
const selectedCenter = ref<Center | null>(null);

const canvas = ref<any>({});
const canvasResult = ref<any>({});
const linkToDownloadActaRef = ref<any>({});
const imageActaResult = ref<any>({});

const states = ref<State[]>([]);
const municipalities = ref<Municipality[]>([]);
const parishes = ref<Parish[]>([]);
const centers = ref<Center[]>([]);

const shouldShowMunicipalityInput = ref(false);
const shouldShowParishInput = ref(false);
const shouldShowCenterInput = ref(false);
const shouldShowTableInput = ref(false);

const resetMunicipality = () => {
  shouldShowMunicipalityInput.value = false;
  selectedMunicipality.value = null;
  state.municipalities = [];
};

const resetParish = () => {
  shouldShowParishInput.value = false;
  selectedParish.value = null;
  state.parishes = [];
};

const resetCenter = () => {
  shouldShowCenterInput.value = false;
  selectedCenter.value = null;
  state.centers = [];
};

const resetTable = () => {
  shouldShowTableInput.value = false;
  tables.value = [];
};

const searchState = (e: { query: string }) => {
  states.value = state.states
    .filter(({ name }) => name.toLowerCase().includes(e.query.toLowerCase()));
};

const searchMunicipality = (e: { query: string }) => {
  municipalities.value = state.municipalities
    .filter(({ name }) => name.toLowerCase().includes(e.query.toLowerCase()));
};

const searchParish = (e: { query: string }) => {
  parishes.value = state.parishes
    .filter(({ name }) => name.toLowerCase().includes(e.query.toLowerCase()));
};

const searchCenter = (e: { query: string }) => {
  centers.value = state.centers
    .filter(({ name }) => name.toLowerCase().includes(e.query.toLowerCase()));
};

const showError = (errorMessage: string) => {
  toast.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
};

const handleStateSelection = () => {
  resetMunicipality();
  withSpinner(fetchMunicipalities);
  resetParish();
  resetCenter();
  resetTable();
  shouldShowMunicipalityInput.value = true;
}

const handleMunicipalitySelection = () => {
  resetParish();
  withSpinner(fetchParishes);
  resetCenter();
  resetTable();
  shouldShowParishInput.value = true;
}

const handleParishSelection = () => {
  resetCenter();
  withSpinner(fetchCenters);
  resetTable();
  shouldShowCenterInput.value = true;
}

const handleCenterSelection = () => {
  resetTable();
  withSpinner(fetchTables);
  shouldShowTableInput.value = true;
}

const handleTableSelection = async (selectedTable: Table) => {
  const image = new Image();
  image.src = getApi().getImageUrl(selectedTable.url);
  getBase64Image(image, (b: string) => {
    const img = new Image();
    img.onload = () => {
      processImage(canvas, canvasResult, img, imageActaResult, linkToDownloadActaRef);
    };
    img.src = b;
  });
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
  // margin: 16px 0;
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
  // width: 100%;
  padding: 0px 16px 0px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  width: 100%;
}

.main-container {
  height: 100%;
  padding-top: 74px;
}

.search-button a {
  color: white;
  text-decoration: none;
}

:deep(.p-inputtext) {
  background: white;
  color: black;
}

:deep(.p-autocomplete) {
  width: 100%;
}

.tables-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.table-button {
  background: #00804d;
  border-radius: 4px;
  border: transparent;
  padding: 8px 16px;
  color: white;
  box-shadow: 0 0 6px -1px black;
  font-weight: bold;
  cursor: pointer;
  display: inline-block;
  width: 4rem;
  height: 4rem;
  ;
}
</style>
