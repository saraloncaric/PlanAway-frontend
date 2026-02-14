<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');

const login = async() => {
    error.value = '';
    try {
        const response = await axios.post('/api/users/login', { email: email.value, password: password.value });        
        localStorage.setItem('token', response.data.jwt_token);        
        window.dispatchEvent(new Event('login'));
        router.push('/');
    } catch(err) {
        error.value = err.response?.data?.poruka || 'Greška pri prijavi'; 
    }
}
</script>
<template>
    <div class="min-h-screen flex items-center justify-center px-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Dobrodošli natrag</h1>
                <p class="text-gray-600">Prijavite se na svoj račun</p>
            </div>
            <!-- <button 
                @click=""
                class="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition mb-6">
                Nastavi s Google računom
            </button>  -->
            <div class="flex items-center gap-4 mb-6">
                <div class="flex-1 h-px bg-gray-300"></div>
                <span class="text-sm text-gray-500">ili</span>
                <div class="flex-1 h-px bg-gray-300"></div>
            </div>
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {{ error }}
            </div>  
            <form @submit.prevent="login" class="space-y-4">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        Email adresa
                    </label>
                    <input id="email" v-model="email" type="email" required placeholder="vas@email.com"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"  />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        Lozinka
                    </label>
                    <input id="password" v-model="password" type="password" required placeholder="••••••••"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    Prijavi se
                </button>
            </form>
            <div class="mt-6 text-center">
                <p class="text-gray-600">
                    Nemate račun?
                    <RouterLink to="/registracija" 
                        class="text-blue-600 font-semibold hover:text-blue-700 hover:underline ml-1">
                        Registrirajte se
                    </RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>