<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const putovanja = ref([]);
const trenutniPage = ref(1);    
const putovanjaPoStr = 16;
const trazilica = ref('');

onMounted(async () => {
    try {
        const res = await axios.get('/api/putovanja');
        putovanja.value = [ ...res.data].sort(() => Math.random() - 0.5)
    } catch(error) {
        console.error('Greška pri dohvaćanju putovanja:', error)
   }
})
const filtriranaPutovanja = computed(() => {
    if (!trazilica.value) {
        return putovanja.value;
    }
    return putovanja.value.filter(putovanje => 
        putovanje.naslov.toLowerCase().includes(trazilica.value.toLowerCase()) ||
        putovanje.destinacija?.toLowerCase().includes(trazilica.value.toLowerCase()) ||
        putovanje.drzava?.toLowerCase().includes(trazilica.value.toLowerCase())
    );
})
const ukupnoStranica = computed(() => {
    return Math.ceil(filtriranaPutovanja.value.length / putovanjaPoStr);
})
const paginacija = computed(() => {
    const start = (trenutniPage.value - 1) * putovanjaPoStr;
    const end = start + putovanjaPoStr;
    return filtriranaPutovanja.value.slice(start, end);
})
const goToPage = (stranica) => {
    trenutniPage.value = stranica;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function resetPage() {
    trenutniPage.value = 1;
}
</script>
<template>
    <div class="p-4 m-5">
        <div class="mb-6">
            <input v-model="trazilica" @input="resetPage" placeholder="Pretraži po naslovu, destinaciji ili državi..." 
                class="w-full md:w-96 p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-400" />
        </div>
        <div v-if="paginacija.length === 0" class="text-center text-gray-500 py-10">
            Nema rezultata za "{{ trazilica }}"
        </div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div 
                v-for="putovanje in paginacija"
                :key="putovanje.putovanje_id"
                class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <img :src="putovanje.image" :alt="putovanje.naslov" class="w-full h-48 object-cover" />

                <div class="p-4">
                    <h2 class="text-lg font-semibold">{{ putovanje.naslov }}</h2>
                    <p class="text-gray-600">{{ putovanje.cijena }} €</p>
                </div>
            </div>
        </div>

        <div class="flex justify-center items-center gap-2 mt-8" v-if="ukupnoStranica">
            <button @click="goToPage(trenutniPage -1 )" :disabled="trenutniPage === 1" 
                class="px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                ←
            </button>
            <button v-for="stranica in ukupnoStranica" :key="stranica" @click="goToPage(stranica)"
                :class="['px-3 py-1 rounded-lg font-medium transition', 
                    trenutniPage === stranica ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"> 
                {{ stranica }}
            </button>
            <button @click="goToPage(trenutniPage + 1)" :disabled="trenutniPage === ukupnoStranica"
                class="px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                →
            </button>
        </div>
    </div>
</template>