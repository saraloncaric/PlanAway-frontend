<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const putovanja = ref([]);
const randomPutovanja = ref([]);


onMounted(async () => {
    try {
        const res = await axios.get('/api/putovanja');
        putovanja.value = res.data;
        randomPutovanja.value = [ ...putovanja.value].sort(() => Math.random() - 0.5)
    } catch(error) {
        console.error('Greška pri dohvaćanju putovanja:', error)
   }
})
</script>
<template>
    <div class="p-4 m-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div 
                v-for="putovanje in randomPutovanja"
                :key="putovanje.id"
                class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <img :src="putovanje.image" :alt="putovanje.naslov" class="w-full h-48 object-cover" />

                <div class="p-4">
                    <h2 class="text-lg font-semibold">{{ putovanje.naslov }}</h2>
                    <p class="text-gray-600">{{ putovanje.cijena }} €</p>
                </div>
            </div>
        </div>
    </div>
</template>