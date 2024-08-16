<script setup lang="ts">
import { AllowedCountries, DocumentTypes, ICreationResponse } from '../Interfaces/authDocument'
import { DocumentService } from '../services/documentService';
import { Ref, ref, watch } from 'vue';

// props
const props = defineProps<{
  userValidation: ICreationResponse | null;
  setValidationData: (data: ICreationResponse) => void;
  searchValidationById: (id: string) => void;
}>();


// Const
const myDocumentService = new DocumentService();
const countryList = Object.values(AllowedCountries);
const documentTypesList = Object.values(DocumentTypes);
const selected_country: Ref<string | null> = ref(null)
const selected_document: Ref<string | null> = ref(null)
const error: Ref<string> = ref('')
const loading: Ref<boolean> = ref(false)
const process_id: Ref<string> = ref("")

// Functions
const submitCreateValidation = async (e: Event) => {
  e.preventDefault();
  loading.value = true;

  if (!selected_country.value || !selected_document.value) return

  try {
    const data = await myDocumentService.createValidation(selected_country.value, selected_document.value)
    props.setValidationData(data)
  } catch (err) {
    error.value = `${err}`
  }

  loading.value = false;
}

const handleSearch = (e: Event) => {
  e.preventDefault()
  props.searchValidationById(process_id.value)
}

watch(error, () => {
  setTimeout(() => {
    error.value = ''
  }, 10000)
})

</script>

<template>

  <section id="section_step1" class="min-h-screen w-full max-w-[1000px] flex flex-col">
    <h2 class="text-2xl">Step 1</h2>
    <p class="text-lg">Create a validation</p>

    <form class="flex justify-center my-[1em]" @submit="submitCreateValidation">
      <div class="w-[90%] md:w-[60%] flex flex-col gap-3 items-center p-2 border-gray-500 border-2 rounded-md">
        <h2 class="text-2xl">Fill data</h2>

        <div class="w-full flex flex-col">
          <label for="text-xl">Country</label>
          <select v-model="selected_country" required class="p-2 border-gray-500 border-2 rounded-md">
            <option v-for="(country, i) in countryList" :value="country" :key="i">{{ country }}</option>
          </select>
          <p class="text-sm">Example: CO for Colombia</p>
        </div>

        <div class="w-full flex flex-col">
          <label for="text-xl">Document</label>
          <select v-model="selected_document" required class="p-2 border-gray-500 border-2 rounded-md">
            <option v-for="(document, i) in documentTypesList" :value="document" :key="i">{{ document }}</option>
          </select>
          <p class="text-sm">Example: national-id for C.C, ID-card, others</p>
        </div>

        <p class="text-red-600">{{ error }}</p>

        <button v-if="!loading"
          class="bg-white p-2 rounded-md border-2 border-gray-500 hover:bg-slate-400 transition-all" type="submit">Send
          data</button>

        <button v-if="loading"
          class="bg-white p-2 rounded-md border-2 border-gray-500 hover:bg-slate-400 transition-all" type="submit"
          disabled>Loading ...</button>

      </div>
    </form>

    <p class="text-center">Are you in a process?</p>

    <form class="flex justify-center my-[1em]"
    @submit="handleSearch"
    >
      <div class="w-[90%] md:w-[60%] flex flex-col gap-3 items-center p-2 border-gray-500 border-2 rounded-md">
        <h2 class="text-2xl">Search validation</h2>

        <div class="w-full flex flex-col">
          <label for="text-xl">Write your process ID</label>
          <input type="text" v-model="process_id" required class="p-2 border-gray-500 border-2 rounded-md">

        </div>

        <button v-if="!loading"
            class="bg-white p-2 rounded-md border-2 border-gray-500 hover:bg-slate-400 transition-all"
            type="submit">Send
            ID</button>

          <button v-if="loading"
            class="bg-white p-2 rounded-md border-2 border-gray-500 hover:bg-slate-400 transition-all" type="submit"
            disabled>Loading ...</button>
      </div>
    </form>

  </section>


</template>

<style scoped></style>
