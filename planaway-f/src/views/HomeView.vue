<script setup>
import { useRoute } from 'vue-router';
import HomeViewSlika from '@/assets/images/HomeViewSlika.jpg';

const route = useRoute();
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
</template>