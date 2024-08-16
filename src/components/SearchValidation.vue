<script setup lang="ts">
import { onBeforeMount, Ref, ref } from 'vue';
import { DocumentValidationResponse, ICreationResponse } from '../Interfaces/authDocument';
import { DocumentService } from '../services/documentService';

// props
const props = defineProps<{
    userValidation: ICreationResponse | null;
    setValidationData: (data: ICreationResponse) => void;
    processId: string | null;
}>();

// const
const myDocumentService = new DocumentService();
const validationResult: Ref<DocumentValidationResponse | null> = ref(null)
const error: Ref<string> = ref("")
const loading: Ref<boolean> = ref(false)

// Functions
const getInformation = async () => {

    let id = "";

    if (props.processId) id = props.processId;

    if (props.userValidation) id = props.userValidation.validation_id;

    loading.value = true;

    try {
        const data = await myDocumentService.getDocumentValidation(id);
        validationResult.value = data
        console.log(data);
        window.scroll(0,0)

    } catch (err) {
        console.log(err);
        error.value = `${err}`
    }

    loading.value = false;
}

onBeforeMount(async () => {
    await getInformation()
})

const handleReload = async () => {
    await getInformation();
}

const handleRetries = async () => {
    if (!validationResult.value) return;

    loading.value = true;

    try {
        const data = await myDocumentService.retryValidation(validationResult.value)
        props.setValidationData(data)
    } catch (err) {
        console.log(err);
        error.value = `${err}`
    }

    loading.value = false;
}

</script>

<template>
    <section id="section_done" class="min-h-screen w-full max-w-[1000px]">
        <h2 class="text-2xl">Process complete!</h2>
        <p class="text-lg">See process status</p>

        <section class="flex justify-center my-[1em]">
            <div class="w-[90%] md:w-[70%] flex flex-col gap-3 items-center p-2 border-gray-500 border-2 rounded-md">
                <h2 :class="{ 'text-red-500': validationResult?.validation_status === 'failure', 'text-green-500': validationResult?.validation_status === 'success' }"
                    class="text-2xl">
                    Status {{ validationResult?.validation_status }}
                </h2>

                <div class="w-full flex flex-col" v-if="validationResult?.validation_status == 'failure'">
                    <label class="text-sky-600 text-lg">Reason</label>
                    <p class="text-lg md:text-xl break-all">{{ validationResult.failure_status }} - {{
                        validationResult.declined_reason }}</p>
                </div>

                <div class="w-full flex flex-col">
                    <label class="text-sky-600 text-lg">Process ID</label>
                    <p class="text-lg md:text-xl break-all">{{ validationResult?.validation_id }}</p>
                    <p class="text-sm text-blue-500">Please save this id</p>
                </div>

                <div class="w-full flex flex-col">
                    <label class="text-sky-600 text-lg">Account ID</label>
                    <p class="text-lg md:text-xl break-all">{{ validationResult?.account_id }}</p>
                </div>

                <div class="w-full bg-slate-500 py-[1px]"></div>

                <div class="w-full flex flex-col">
                    <label class="text-sky-600 text-lg">Creation date</label>
                    <p class="text-lg md:text-xl break-all">{{ validationResult?.creation_date }}</p>
                </div>

                <div class="w-full flex flex-col">
                    <label class="text-sky-600 text-lg">Country</label>
                    <p class="text-lg md:text-xl break-all">{{ validationResult?.validation_inputs.country }}</p>
                </div>

                <div class="w-full flex flex-col">
                    <label class="text-sky-600 text-lg">Document</label>
                    <p class="text-lg md:text-xl break-all">{{ validationResult?.validation_inputs.document_type }}</p>
                </div>

                <div class="w-full flex flex-col">
                    <label class="text-sky-600 text-lg">Remaining retries</label>
                    <p class="text-lg md:text-xl break-all">{{ validationResult?.remaining_retries }}</p>
                    <p class="text-lg md:text-xl break-all" v-if="!validationResult?.remaining_retries">You don't have more retries</p>
                </div>

                <div class="w-full bg-slate-500 py-[1px]"></div>

                <div class="w-full flex flex-col gap-2">
                    <label class="text-sky-600 text-lg">Documents uploaded</label>
                    <img class="w-[80%] m-auto" v-for="(link, i) in validationResult?.user_response.input_files"
                        :src="link" :key="i">
                </div>

                <div class="w-full flex flex-col items-center" v-if="validationResult?.validation_status == 'pending'">
                    <p class="text-sm text-blue-800">If status
                        is
                        pending, you can refresh and see any change</p>

                    <p class="text-red-600">{{ error }}</p>

                    <button v-if="!loading"
                        class="bg-white p-2 rounded-md border-2 border-gray-500 hover:bg-slate-400 transition-all w-[70%]"
                        @click="handleReload">Refresh status</button>

                    <button v-if="loading"
                        class="bg-white p-2 rounded-md border-2 border-gray-500 hover:bg-slate-400 transition-all w-[70%]"
                        disabled>Please wait...</button>
                </div>

                <div class="w-full flex flex-col items-center" v-if="validationResult?.validation_status == 'failure'">
                    <p class="text-sm text-blue-800">Try to upload your data again</p>

                    <p class="text-red-600">{{ error }}</p>

                    <button v-if="!loading"
                        class="bg-white p-2 rounded-md border-2 border-gray-500 hover:bg-slate-400 transition-all w-[70%]"
                        @click="handleRetries">Upload again</button>

                    <button v-if="loading"
                        class="bg-white p-2 rounded-md border-2 border-gray-500 hover:bg-slate-400 transition-all w-[70%]"
                        disabled>Please wait...</button>
                </div>

            </div>
        </section>
    </section>

</template>

<style></style>
