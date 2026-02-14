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
        const userResponse = await axios.get('/api/users/ime', {
            headers: { Authorization: `Bearer ${token}`}
        })
        const user_id = userResponse.data.user_id;
        const agencijaResponse = await axios.get('/api/agencije', {
            headers: { Authorization: `Bearer ${token}`}
        })
        const agencija = agencijaResponse.data.find(a => a.user_id === user_id);
        if(!agencija) {
            error.value = 'Agencija nije pronađena';
            return;
        }
        const response = await axios.get(`/api/agencije/${agencija.agencija_id}/putovanja`);  
        putovanja.value = response.data;
    } catch(err) {
        error.value = 'Greška pri dohvaćanju putovanja';
        console.error(err);
    }
}
const obrisiPutovanje = async(putovanje_id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/putovanja/${putovanje_id}`, {
            headers: { Authorization: `Bearer ${token}`}
        })
        putovanja.value = putovanja.value.filter(p => p.putovanje_id !== putovanje_id);
    } catch(err) {
        error.value = 'Greška pri brisanju';
        console.error(err);
    }
}
onMounted(() => {
    dohvatiSvaPutovanja();
})
</script>
<template>
    <div class="min-h-screen bg-gray-50 pb-10">
        <div v-if="error" class="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {{ error }}
        </div>
        <div class="mx-6 mt-6">
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