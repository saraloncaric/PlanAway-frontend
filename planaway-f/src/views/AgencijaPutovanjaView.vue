<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const putovanja = ref([]);
const error = ref('');

const dohvatiSvaPutovanja = async() => {
    try {
        const token = localStorage.getItem('token');
        const userResponse = await axios.get(import.meta.env.VITE_API_URL + 'api/users/ime', {
            headers: { Authorization: `Bearer ${token}`}
        })
        const user_id = userResponse.data.user_id;
        const agencijaResponse = await axios.get(import.meta.env.VITE_API_URL + 'api/agencije', {
            headers: { Authorization: `Bearer ${token}`}
        })
        const agencija = agencijaResponse.data.find(a => a.user_id === user_id);
        if(!agencija) {
            error.value = 'Agencija nije pronađena';
            return;
        }
        const response = await axios.get(import.meta.env.VITE_API_URL +  `api/agencije/${agencija.agencija_id}/putovanja`);  
        putovanja.value = response.data;
    } catch(err) {
        console.error('Greška pri dohvaćanju putovanja', err);
    }
}
const obrisiPutovanje = async(putovanje_id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(import.meta.env.VITE_API_URL + `api/putovanja/${putovanje_id}`, {
            headers: { Authorization: `Bearer ${token}`}
        })
        putovanja.value = putovanja.value.filter(p => p.putovanje_id !== putovanje_id);
    } catch(err) {
        console.error('Greška pri brisanju', err);
    }
}
onMounted(() => {
    dohvatiSvaPutovanja();
})
</script>
<template>
    <div class="min-h-screen bg-gray-50 pb-10">
        <div class="mx-6 mt-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Moja putovanja</h1>
                <RouterLink 
                    to="/novoputovanje"
                    class="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center gap-2">
                    + Dodaj putovanje
                </RouterLink>
            </div>
            <div v-if="!putovanja || putovanja.length === 0" class="text-center py-20">
                <p class="text-gray-500 mb-4">Nemate dodanih putovanja</p>
                <RouterLink 
                    to="/novoputovanje"
                    class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition">
                    Dodaj prvo putovanje
                </RouterLink>
            </div>
            <div v-if="putovanja.length === 0" class="text-center py-20">
                <p class="text-gray-500 text-lg">Nemate putovanja</p>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div 
                    v-for="putovanje in putovanja" :key="putovanje.putovanje_id"
                    class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                    <img :src="putovanje.image" :alt="putovanje.naslov" class="w-full h-48 object-cover" />
                    <div class="p-4">
                        <div class="flex items-start justify-between mb-1">
                            <h2 class="text-lg font-semibold">
                                {{ putovanje.destinacija }}, {{ putovanje.drzava }}
                            </h2>
                            <button @click="obrisiPutovanje(putovanje.putovanje_id)"
                                class="text-gray-400 hover:text-red-500 transition ml-2 cursor-pointer">
                                🗑
                            </button>
                        </div>
                        <p class="text-gray-500 text-sm mb-3">
                            {{ putovanje.broj_dana }} dana/{{ putovanje.broj_noci }}noći
                        </p>
                        <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                            {{ putovanje.opis }}
                        </p>
                        <div class="flex items-center justify-between">
                            <span class="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-lg">
                                {{ putovanje.cijena }}€
                            </span>
                            <RouterLink :to="`/trips/${putovanje.putovanje_id}`"
                                class="bg-blue-100 hover:bg-blue-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg transition">
                                Detalji
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>