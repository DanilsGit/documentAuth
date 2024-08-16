<script setup lang="ts">
import { ref, Ref } from "vue"
import CreateValidation from "./components/CreateValidation.vue";
import { ICreationResponse, route_validator } from "./Interfaces/authDocument";
import UploadDocument from "./components/UploadDocument.vue";
import SearchValidation from "./components/SearchValidation.vue";

// const
const validationData: Ref<ICreationResponse | null> = ref(null)
const route: Ref<route_validator> = ref("CREATE")
const process_id: Ref<string | null> = ref(null)

// Functions
const setValidationData = (data: ICreationResponse) => {
  validationData.value = data
  route.value = "UPLOAD"
}

const setNeedValidate = (set: route_validator) => {
  route.value = set;
}

const searchValidationById = (id: string) => {
  process_id.value = id
  route.value = "DONE"
}

</script>

<template>
  <!-- VLD7b4e791893a6c4eea51393f99ed228b1 -->
  <header class="p-[1em] text-center">
    <h1 class="text-3xl">Let's auth!</h1>
  </header>

  <main class="w-full px-5 flex flex-col items-center">
    <CreateValidation v-if="route == 'CREATE'" :user-validation="validationData" :search-validation-by-id="searchValidationById"
      :set-validation-data="setValidationData" />
    <UploadDocument v-if="route == 'UPLOAD'" :user-validation="validationData" :set-need-validate="setNeedValidate" />
    <SearchValidation v-if="route == 'DONE'" :user-validation="validationData" :process-id="process_id"
      :set-validation-data="setValidationData" />
  </main>
</template>

<style></style>
