<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const upiti = ref([]);

const dohvatiUpite = async() => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(import.meta.env.VITE_API_URL + 'api/upiti/agencija', {
            headers: { Authorization: `Bearer ${token}`}
        })
        upiti.value = response.data;
    } catch(err) {
        console.error('Greška pri dohvaćanju upita', err);
    }
}
const promjeniStatus = async(upit_id, noviStatus) => {
    try {
        const token = localStorage.getItem('token');
        await axios.put(import.meta.env.VITE_API_URL + `api/upiti/${upit_id}`, 
            { status: noviStatus },
            { headers: { Authorization: `Bearer ${token}` }}
        );
        const upit = upiti.value.find(u => u.upit_id === upit_id);
        if(upit) {
            upit.status = noviStatus;
        }
    } catch(err) {
        console.error('Greška pri ažuriranju statusa:', err);
    }
}
const obrisiUpit = async(upit_id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(import.meta.env.VITE_API_URL + `api/upiti/${upit_id}`, {
            headers: { Authorization: `Bearer ${token}`}
        })
        upiti.value = upiti.value.filter(u => u.upit_id === upit_id);
    } catch(err) {
        console.error('Greška pri brisanju upita:', err);
    }
}
const Ndatum = (datum) => {
    return new Date(datum).toLocaleDateString('hr-HR');
}
onMounted(() => {
    dohvatiUpite();
})
</script>
<template>
    <div class="min-h-screen bg-gray-50 pb-10">
        <div class="mx-6 mt-6 bg-white rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-100 border-b-2 border-gray-200">
                        <tr>
                            <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Putovanje
                            </th>
                            <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Korisnik
                            </th>
                            <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Broj osoba
                            </th>
                            <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Datum polaska
                            </th>
                            <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Status upita
                            </th>
                            <th class="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Obriši
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divade-y divide-gray-200">
                        <tr v-for="upit in upiti" :key="upit.upit_id" class="hover:bg-gray-50 transition">
                            <td class="px-6 py-4 whitecpace-nowrap">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ upit.naslov || upit.destinacija }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitecpace-nowrap">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ upit.kontakt_email || upit.email }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitecpace-nowrap">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ upit.broj_ljudi }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitecpace-nowrap">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ Ndatum(upit.start_date) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <select 
                                    v-model="upit.status" 
                                    @change="promjeniStatus(upit.upit_id, upit.status)"
                                    class="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                    <option value="novi">Novi</option>
                                    <option value="pregledan">Pregledan</option>
                                    <option value="odgovoren">Odgovoren</option>
                                    <option value="odbijen">Obijen</option>
                                    <option value="prihvaćen">Prihvaćen</option>
                                </select>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button @click="obrisiUpit(upit.upit_id)" 
                                    class="text-red-600 hover:text-red-800 font-medium text-sm">
                                    Obriši
                                </button>
                            </td>
                        </tr>
                        <tr v-if="upiti.length === 0">
                            <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                                Nema upita za vašu agenciju
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>