<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const logiranUser = ref(false);
const user = ref(null);

const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        logiranUser.value = false;
        user.value = null;
        return;
    }
    try {
        const response = await axios.get('/api/users/ime', {
            headers: { Authorization: `Bearer ${token}` }
        });
        user.value = response.data;
        logiranUser.value = true;
    } catch (error) {
        logout();
    }
};
const logout = () => {
    localStorage.removeItem('token');
    logiranUser.value = false;
    user.value = null;
    router.push('/login');
};
onMounted(() => {
    checkAuth();
    window.addEventListener('login', checkAuth);
});
onBeforeUnmount(() => {
    window.removeEventListener('login', checkAuth);
});
router.afterEach(() => {
    checkAuth();
});
</script>

<template>
    <header class="w-full fixed bg-blue-100">
        <div class="flex items-center justify-between relative z-10">
            <RouterLink to="/" class="p-3 hover:text-blue-600 font-bold font-serif">PlanAway</RouterLink>
            <div v-if="user?.user_type === 'korisnik'" class="flex items-center space-x-4 p-3">
                <RouterLink to="/trips" class="hover:text-blue-600">Putovanja</RouterLink>
                <RouterLink to="/wishlist" class="hover:text-blue-600">Wishlist</RouterLink>
                <RouterLink to="/todo" class="hover:text-blue-600">To-Do</RouterLink>
                <RouterLink v-if="!logiranUser" to="/login" class="hover:text-blue-600">
                    Login
                </RouterLink>
                <div v-else class="flex items-center gap-3">
                    <button @click="logout" class="hover:text-blue-600 cursor-pointer">
                        Odjava
                    </button>
                </div>
            </div>
            <div v-else-if="user?.user_type === 'agencija'" class="flex items-center space-x-4 p-3">
                <RouterLink to="/agencijap" class="hover:text-blue-600">Putovanja</RouterLink>
                <RouterLink to="/upiti" class="hover:text-blue-600">Upiti</RouterLink>
                <RouterLink to="/profil" class="hover:text-blue-600">Profil</RouterLink>
                <RouterLink v-if="!logiranUser" to="/login" class="hover:text-blue-600">
                    Login
                </RouterLink>
                <div v-else class="flex items-center gap-3">
                    <button @click="logout" class="hover:text-blue-600 cursor-pointer">
                        Odjava
                    </button>
                </div>
            </div>
            <div v-else class="flex items-center space-x-4 p-3">
                <RouterLink to="/trips" class="hover:text-blue-600">Putovanja</RouterLink>
                <RouterLink to="/login" class="hover:text-blue-600">Wishlist</RouterLink>
                <RouterLink to="/login" class="hover:text-blue-600">To-Do</RouterLink>
                <RouterLink to="/login" class="hover:text-blue-600">Login</RouterLink>
            </div>
        </div>
    </header>
</template>