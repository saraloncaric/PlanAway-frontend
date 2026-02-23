<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const agencija = ref(null);
const uređivanje = ref(false);
const spremi = ref(false);

const forma = ref({
    naziv_agencije: '',
    opis: '',
    kontakt_broj: '',
    kontakt_email: ''
});

const postoji = ref(false);

const dohvatiAgenciju = async () => {
    try {
        const token = localStorage.getItem('token');
        let agencija_id = route.params.id;
        if(!agencija_id && token) {
            const user_response = await axios.get(import.meta.env.VITE_API_URL + '/api/users/ime', {
                headers: { Authorization: `Bearer ${token}`}
            })
            const agencijeRes = await axios.get(import.meta.env.VITE_API_URL + '/api/agencije');
            const mojaAgencija = agencijeRes.data.find(a => a.user_id === user_response.data.user_id);
            if (mojaAgencija) {
                agencija_id = mojaAgencija.agencija_id;
                postoji.value = true;
            }
        }
        const response = await axios.get(import.meta.env.VITE_API_URL + `/api/agencije/${agencija_id}`);
        agencija.value = response.data;
        
        if (token && !postoji.value) {
            const user_response = await axios.get(import.meta.env.VITE_API_URL + '/api/users/ime', {
                headers: { Authorization: `Bearer ${token}`}
            });
            postoji.value = user_response.data.user_type === 'agencija' && 
                agencija.value.user_id === user_response.data.user_id;
        }
        forma.value = {
            naziv_agencije: agencija.value.naziv_agencije,
            opis: agencija.value.opis,
            kontakt_broj: agencija.value.kontakt_broj,
            kontakt_email: agencija.value.kontakt_email
        }
    } catch(err) {
        console.error('Greška pri dohvaćanju agencije', err);
    }
}
const promjene = async() => {
    spremi.value = true;
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(import.meta.env.VITE_API_URL + `/api/agencije/${agencija.value.agencija_id}`, 
            forma.value,
            { headers: { Authorization: `Bearer ${token}`}}
        )
        agencija.value = response.data.agencija;
        uređivanje.value = false;
    } catch(err) {
        console.error('Greška pri ažuriranju', err);
    } finally {
        spremi.value = false;
    }
}
const otkaziPromjene = () => {
    forma.value = {
        naziv_agencije: agencija.value.naziv_agencije,
        opis: agencija.value.opis,
        kontakt_broj: agencija.value.kontakt_broj,
        kontakt_email: agencija.value.kontakt_email
    };
    uređivanje.value = false;
}
const inicijali = computed(() => {
    if (!agencija.value?.naziv_agencije) return '';
    return agencija.value.naziv_agencije
        .split(' ')
        .map(r => r[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
});
const formatDatum = (datum) => {
    if (!datum) return '';
    return new Date(datum).getFullYear();
};
onMounted(() => {
    dohvatiAgenciju();
})
</script>
<template>
    <div class="min-h-screen bg-gray-50 pb-10">
        <div v-if="agencija" class="max-w-4xl mx-auto px-6">
            <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div class="w-24 h-24 rounded-full bg-blue-400 flex items-center justify-center">
                        <span class="text-white text-2xl font-bold">{{ inicijali }}</span>
                    </div>
                    <div class="flex-1 text-center sm:text-left">
                        <div v-if="!uređivanje">
                            <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ agencija.naziv_agencije }}</h1>
                            <div class="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                                <span class="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
                                    Certificirana agencija
                                </span>
                                <span class="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                                    Od {{ formatDatum(agencija.datum_osnivanja) }}.
                                </span>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                <div class="bg-blue-50 rounded-xl p-3">
                                    <p class="text-xs font-semibold text-gray-500 mb-1">Email</p>
                                    <p class="text-sm text-gray-800">{{ agencija.kontakt_email }}</p>
                                </div>
                                <div class="bg-blue-50 rounded-xl p-3">
                                    <p class="text-xs font-semibold text-gray-500 mb-1">Telefon</p>
                                    <p class="text-sm text-gray-800">{{ agencija.kontakt_broj }}</p>
                                </div>
                            </div>  
                        </div>
                        <div v-else class="space-y-3 w-full">
                            <input v-model="forma.naziv_agencije" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-bold"
                                placeholder="Naziv agencije" 
                            />
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="text-xs font-semibold text-gray-500">Email</label>
                                    <input v-model="forma.kontakt_email"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Email" 
                                    />
                                </div>
                                <div>
                                    <label class="text-xs font-semibold text-gray-500">Telefon</label>
                                    <input v-model="forma.kontakt_broj"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Telefon"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="postoji" class="flex gap-2">
                        <div v-if="!uređivanje">
                            <button 
                                @click="uređivanje = true"
                                class="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-4 py-2 rounded-lg transition text-sm">
                                Uredi profil
                            </button>
                        </div>
                        <div v-else class="flex gap-2">
                            <button 
                                @click="promjene"
                                :disabled="spremi"
                                class="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition text-sm disabled:opacity-50">
                                {{ spremi ? 'Spremanje' : 'Spremi' }}
                            </button>
                            <button 
                                @click="otkaziPromjene"
                                class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition text-sm">
                                Odustani
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">O nama</h2>
                <p v-if="!uređivanje" class="text-gray-600 leading-relaxed whitespace-pre-line">
                    {{ agencija.opis }}
                </p>
                <textarea v-else v-model="forma.opis" rows="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    placeholder="Opis agencije..."
                />
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">Zašto odabrati nas?</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="bg-gray-100 rounded-2xl p-6 text-center">
                        <p class="font-bold text-gray-800 mb-2">Najbolje cijene</p>
                        <p class="text-gray-600 text-sm">Garantiramo konkurentne cijene i vrhunsku kvalitetu</p>
                    </div>
                    <div class="bg-gray-100 rounded-2xl p-6 text-center">
                        <p class="font-bold text-gray-800 mb-2">Sigurnost na prvom mjestu</p>
                        <p class="text-gray-600 text-sm">Sva putovanja su potpuno osigurana i certificirana</p>
                    </div>
                    <div class="bg-gray-100 rounded-2xl p-6 text-center">
                        <p class="font-bold text-gray-800 mb-2">Podrška 24/7</p>
                        <p class="text-gray-600 text-sm">Naš tim je uvijek dostupan za sva vaša pitanja</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>