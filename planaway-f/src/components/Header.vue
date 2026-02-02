<script setup>
import { useRoute, useRouter, RouterLink } from 'vue-router';

const router = useRouter();
const route = useRoute();
</script>

<template>
    <header class="w-full fixed bg-blue-100">
        <div class="flex items-center justify-between relative z-10">
            <RouterLink to="/" class="p-3 hover:text-blue-600 font-bold font-serif">PlanAway</RouterLink>
            <div class="flex items-center space-x-4 p-3">
                <RouterLink to="/trips" class="hover:text-blue-600">Putovanja</RouterLink>
                <RouterLink to="/wishlist" class="hover:text-blue-600">Wishlist</RouterLink>
                <RouterLink to="/todo" class="hover:text-blue-600">To-Do</RouterLink>
                <RouterLink to="/login" class="hover:text-blue-600">Login</RouterLink>
            </div>
        </div>
    </header>
</template>