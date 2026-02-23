<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const wishlist = ref([]);
const upiti = ref([]);

const dohvatiWishlistu = async() => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/wishlist/korisnik', {
            headers: { Authorization: `Bearer ${token}`}
        })
        wishlist.value = response.data;
    } catch(err) {
        console.error('Greška pri dohvaćanju wishliste', err)
    }
}
const ukloniIzWishliste = async(wishlist_id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`/api/wishlist/${wishlist_id}`, {
            headers: { Authorization: `Bearer ${token}`}
        })
        wishlist.value = wishlist.value.filter(w => w.wishlist_id !== wishlist_id); 
    } catch(err) {
        console.error('Greška pri brisanju sa wishliste:', err)
    }
}
const dohvatiUpite = async() => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/upiti/moji-upiti', {
            headers: { Authorization: `Bearer ${token}`}
        })
        upiti.value = response.data;
    } catch(err) {
        console.error('Greška pri dohvaćanju poslanih upita', err)
    }
}
const statusUpita = (status) => {
    const boje = {
        'novi': 'bg-blue-100 text-blue-700',
        'u procesu obrade': 'bg-yellow-100 text-yellow-700',
        'prihvaćen': 'bg-green-100 text-green-700',
        'odbijen': 'bg-red-100 text-red-700'
    }
    return boje[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
}
onMounted(() => {
    dohvatiWishlistu();
    dohvatiUpite();
})
</script>
<template>
    <div class="min-h-screen bg-gray-50 pb-10">
        <div class="m-6">
            <h1 class="text-3xl font-semibold mb-2">Moja wishlista</h1>
        </div>
        <div v-if="wishlist.length > 0" class="mx-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="item in wishlist" :key="item.wishlist_id" 
                class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition">
                <div class="relative">
                    <img :src="item.image" :alt="item.naslov" class="w-full h-48 object-cover" />
                    <button @click="ukloniIzWishliste(item.wishlist_id)" 
                        class="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition">
                        Ukloni
                    </button>
                </div>
                <div class="p-4">
                    <h2 class="text-xl font-semibold mb-1">{{ item.destinacija }}, {{ item.drzava }}</h2>
                    <p class="text-gray-600 text-sm mb-3">{{ item.broj_dana }} dana/{{ item.broj_noci }} noći</p>
                    <p class="text-gray-700 text-sm mb-4 line-clamp-2">{{ item.naslov }}</p>
                    <div class="flex items-center justify-bettween gap-1.5">
                        <span class="text-lg font-semibold bg-green-100 text-green-800 px-3 py-1.5 rounded-sm">
                            {{ item.cijena }}€
                        </span>
                        <RouterLink :to="`/trips/${item.putovanje_id}`" 
                            class="bg-blue-200 hover:bg-blue-300 text-gray-800 font-medium px-4 py-2 rounded-sm transition">
                            Detalji
                    </RouterLink>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center py-20">
            <h2 class="text-2xl font-semibold text-gray-700 mb-2">Nemas ništa na wishlisti</h2>
            <RouterLink to="/trips" class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition">
                Pretraži putovanja
            </RouterLink>
        </div>
        <div v-if="wishlist.length > 0" class="mx-6 mt-12">
            <h2 class="text-2xl font-semibold mb-6">Poslani upiti za putovanje:</h2>
            <div v-if="upiti.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="upit in upiti" :key="upit.upit_id" 
                    class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-lg font-semibold text-gray-800">{{ upit.destinacija }}</h3>
                            <span class="text-xs font-medium px-3 py-1 rounded-full" :class="statusUpita(upit.status)">
                                {{ upit.status }}
                            </span>
                        </div>
                        <p class="text-gray-600 text-sm mb-2">{{ upit.naslov }}</p>
                        <div class="border-t pt-3 mb-3">
                            <p class="text-sm text-gray-600 mb-1">
                                <span class="font-medium">Agencija:</span> {{ upit.naziv_agencije }}
                            </p>
                            <p class="text-sm text-gray-600">
                                <span class="font-medium">Broj ljudi:</span> {{ upit.broj_ljudi }}
                            </p>
                        </div>  
                        <div class="flex items-center justify-between pt-3 border-t">
                            <span class="text-lg font-bold text-green-600">{{ upit.cijena }}€</span>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
        <div v-if="wishlist.length > 0" class="text-right mx-6 mt-6">
            <RouterLink to="/trips" class="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Pretraži još putovanja →
            </RouterLink>
        </div>
    </div>
</template>