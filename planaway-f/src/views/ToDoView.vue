<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';

const zadaci = ref([]);
const error = ref('');

const dohvatiZadatke = async() => {
    error.value = '';
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(import.meta.env.VITE_API_URL + '/api/todo/liste', {
            headers: { Authorization: `Bearer ${token}`}
        })
        zadaci.value = response.data;
    } catch(err) {
        console.error('Greška pri dohvaćanju zadataka', err);
    }
}
const poKategorijama = computed(() => {
    const grupe = {};
    zadaci.value.forEach(zadatak => {
        const kategorijaZ = zadatak.kategorija || 'Ostalo';
        if(!grupe[kategorijaZ]) {
            grupe[kategorijaZ] = {
                naslov: kategorijaZ,
                zadaci: [],
                noviZadatak: ''
            }
        }
        grupe[kategorijaZ].zadaci.push(zadatak)
    })
    return Object.values(grupe);
}) 
const dodajNoviZadatak = async(kategorija) => {
    error.value = '';
    if(!kategorija.noviZadatak.trim()) return ;
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(import.meta.env.VITE_API_URL + '/api/todo', 
            { tekst: kategorija.noviZadatak, kategorija: kategorija.naslov },
            { headers: { Authorization: `Bearer ${token}` }}
        );
        zadaci.value.push(response.data.todo);  
        kategorija.noviZadatak = '';
    } catch(err) {
        console.error('Greška pri dodavanju zadatka:', err);
    }
}
const zavrsenZadatak = async (zadatak) => {
    error.value = '';
    try {
        const token = localStorage.getItem('token');
        await axios.put(import.meta.env.VITE_API_URL + `/api/todo/${zadatak.zadatak_id}`, 
            { zavrsen: !zadatak.zavrsen },
            { headers: { Authorization: `Bearer ${token}` }}
        )
    } catch(err) {
        console.error('Greška pri ažuriranju zadatka:', err);
    }
}
const obrisiZadatak = async(zadatakId) => {
    error.value = '';
    try {
        const token = localStorage.getItem('token');
        await axios.delete(import.meta.env.VITE_API_URL + `/api/todo/${zadatakId}`, 
            { headers: { Authorization: `Bearer ${token}` } });
        zadaci.value = zadaci.value.filter(z => z.zadatak_id !== zadatakId)
    } catch(err) {
        console.error('Greška pri brisanju zadatka:', err);
    }
}
onMounted(() => {
    dohvatiZadatke();
})
</script>
<template>
    <div class="min-h-screen bg-gray-50">
        <div class="m-6 p-2">
            <h1 class="font-semibold text-2xl">To-Do Liste</h1>
            <p class="mt-2">Organiziraj sve za svoje putovanje</p>
        </div>

        <div class="mx-6 space-y-6 pb-10">
            <div v-for="kategorija in poKategorijama" :key="kategorija.naslov"
                class="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 class="mb-4 font-semibold text-lg">
                    {{ kategorija.naslov }}
                </h2>
                <div class="flex gap-3 mb-4">
                    <input 
                        v-model="kategorija.noviZadatak" @keyup.enter="dodajNoviZadatak(kategorija)" 
                        type="text"
                        placeholder="Dodaj novi zadatak" 
                        class="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
                    />
                    <button @click="dodajNoviZadatak(kategorija)" class="px-6 py-3 bg-blue-200 hover:bg-blue-300 rounded-lg font-medium transition">
                        + Dodaj
                    </button>
                </div>
                <div class="space-y-2">
                    <div v-for="zadatak in kategorija.zadaci" :key="zadatak.zadatak_id"
                        class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition group">
                        <input type="checkbox" :checked="zadatak.zavrsen" @change="zavrsenZadatak(zadatak)"
                            class="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-400 cursor-pointer" 
                        />
                        <span :class="['flex text-gray-800', zadatak.zavrsen ? 'line-through text-gray-400' : '']">
                            {{ zadatak.tekst }}
                        </span>
                        <button @click="obrisiZadatak(zadatak.zadatak_id)" class="text-red-500 hover:text-red-700 font-medium ml-auto">
                            Obriši
                        </button>
                    </div>
                </div>
                <p v-if="kategorija.zadaci.length === 0" class="text-gray-400 text-center py-4">
                    Nema zadataka
                </p>
            </div>
        </div>
        <div v-if="poKategorijama.length === 0" class="text-center py-10">
            <p class="text-gray-500 text-lg">Nemaš nijedan zadatak.</p>
            <p class="text-gray-400 mt-2">Kreiraj prvi zadatak</p>
        </div>
    </div>
</template>