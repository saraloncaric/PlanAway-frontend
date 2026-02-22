<script setup>
import { useRoute } from 'vue-router';
import HomeViewSlika from '@/assets/images/HomeViewSlika.jpg';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const route = useRoute();
const putovanja = ref([]);
const randomPutovanja = ref([]);

onMounted(async () => {
    try {
        const res = await axios.get('/api/putovanja');
        putovanja.value = res.data;
        randomPutovanja.value = [ ...putovanja.value]
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
    } catch(error) {
        console.error('Greška pri dohvaćanju putovanja:', error)
   }
})
</script>

<template>
    <div class="relative w-full h-[60vh]">
        <img :src="HomeViewSlika" class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 bg-black/30"></div>
        <div class="relative z-10 flex h-full items-center">
            <div class="max-w-4xl px-10 text-white">
                <h1 class="text-5xl md:text-6xl font-serif mb-6 text-center">
                    Discover Your <br/>
                    Next Journey
                </h1>
                <p class="text-lg md:text-xl mb-8 max-w-xl text-center">
                    Pronađi savršeno putovanje za nezaboravno iskustvo
                </p>
                <div class="flex justify-center">
                    <RouterLink to="/trips" class="px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition">
                        Istraži ponudu
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>

    <div class="p-4 m-3 mt-8">
        <p class="text-xl font-semibold mb-4">Popularne destinacije</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div 
                v-for="putovanje in randomPutovanja"
                :key="putovanje.id"
                class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <img :src="putovanje.image" :alt="putovanje.naslov" class="w-full h-48 object-cover" />

                <div class="p-4">
                    <div class="flex items-start justify-between mb-1">
                        <h2 class="text-lg font-semibold">
                            {{ putovanje.destinacija }}, {{ putovanje.drzava }}
                        </h2>
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

    <div class="p-4 m-3 grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div class="flex flex-col items-center text-center gap-2 p-5">
            <RouterLink to="/trips">
                <v-icon name="fc-search" scale="2.5" class="cursor-pointer" />
            </RouterLink>
            <p class="text-lg font-medium">Pretraživanje</p>
            <p class="text-gray-600">Filtriraj i pronađi savršeno putovanje <br/> prema svojim željama</p>
        </div>
        <div class="flex flex-col items-center text-center gap-2 p-5">
            <RouterLink to="/wishlist">
                <v-icon name="fa-regular-heart" scale="2.5" class="cursor-pointer" />
            </RouterLink>
            <p class="text-lg font-medium">Wishlist</p>
            <p class="text-gray-600">Spremi svoja omiljena putovanja za kasnije</p>
        </div>
        <div class="flex flex-col items-center text-center gap-2 p-5">
            <RouterLink to="/todo">
                <v-icon name="fc-todo-list" scale="2.5" class="cursor-pointer" />
            </RouterLink>
            <p class="text-lg font-medium">ToDo Lista</p>
            <p class="text-gray-600">Organiziraj sve što trebaš za putovanje</p>
        </div>
    </div>
</template>