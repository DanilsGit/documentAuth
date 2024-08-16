<script setup lang="ts">
import { ref, Ref, watch } from 'vue';
import { ICreationResponse, route_validator } from '../Interfaces/authDocument';
import { DocumentService } from '../services/documentService';

// props
const props = defineProps<{
    userValidation: ICreationResponse | null;
    setNeedValidate: (set: route_validator) => void;
}>();

// const
const file: Ref<File | null> = ref(null);
const maxSize = 30 * 1024 * 1024;
const myDocumentService = new DocumentService();
const loading: Ref<boolean> = ref(false)
const error:Ref<string> = ref('')
const sideDocument:Ref<"FRONT" | "BACK"> = ref("FRONT")

// Functions
const readFile = async () => {
    if (!props.userValidation) return;
    if (!file.value) return;

    if (file.value.size > maxSize) {
        alert('Image size is more than 30MB')
        return
    }

    loading.value = true;


    const binaryData = await file.value.arrayBuffer()
    const contentType = file.value.type;
    const frontUrl = props.userValidation.instructions.front_url;
    const backUrl = props.userValidation.instructions.reverse_url;

    try {

        if (sideDocument.value == "FRONT") {
            const data = await myDocumentService.uploadDocumentFront(binaryData, contentType, frontUrl)
            console.log(data);
            if (backUrl) {
                sideDocument.value = "BACK"
            }else{
                props.setNeedValidate('DONE')
            }
        }
        else if (sideDocument.value == "BACK") {
            if (!backUrl) return;
            console.log(backUrl);
            const data = await myDocumentService.uploadDocumentFront(binaryData, contentType, backUrl)
            console.log(data);
            props.setNeedValidate('DONE')
        }
    } catch (err) {
        error.value = `${err}`
    }

    loading.value = false;
    file.value = null;

    const input = document.getElementById('inputFile') as HTMLInputElement;
    input.value = '';
}

const handleFile = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0]) {
        file.value = target.files[0];
    }
}

watch(error, ()=>{
    setTimeout(() => {
        error.value = ''
    }, 10000);
})

</script>

<template>
    <section id="section_step2" class="min-h-screen w-full max-w-[1000px]">
        <h2 class="text-2xl">{{ sideDocument == "FRONT" ? 'Step 2' : 'Step 3' }}</h2>
        <p class="text-lg">Upload Document Picture - {{ sideDocument == "FRONT" ? 'Front' : 'Reverse' }}</p>

        <form class="flex justify-center my-[1em]" @submit.prevent="readFile">
            <div class="w-[90%] md:w-[60%] flex flex-col gap-3 items-center p-2 border-gray-500 border-2 rounded-md">
                <h2 class="text-2xl">Upload {{ sideDocument == "FRONT" ? 'Front' : 'Reverse' }} document</h2>
                <p>Example</p>
                <img v-if="sideDocument == 'FRONT'" class="w-[70%] rounded-xl" src="/front_card.png">
                <img v-else class="w-[70%] rounded-xl" src="/reverse_card.png">
                <div class="w-full bg-slate-500 py-[1px]"></div>
                <label>Upload yours | 30MB max</label>
                <input @change="handleFile" id="inputFile" type="file" accept=".jpeg, .jpg, .png" required>

                <p class="text-red-600">{{ error }}</p>

                <button v-if="!loading"
                    class="bg-white p-2 rounded-md border-2 border-gray-500 hover:bg-slate-400 transition-all"
                    type="submit">Send document</button>

                <button v-if="loading"
                    class="bg-white p-2 rounded-md border-2 border-gray-500 hover:bg-slate-400 transition-all"
                    type="submit" disabled>Loading ...</button>
            </div>
        </form>
    </section>

</template>

<style scoped></style>
