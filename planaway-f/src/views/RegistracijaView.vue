<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const ime = ref('');
const prezime = ref('');
const email = ref('');
const password = ref('');
const potvrdaLozinke = ref('');
const error = ref('');

const registracija = async () => {
    error.value = '';
    if(password.value !== potvrdaLozinke.value) {
        error.value = 'Lozinke se ne podudaraju'
        return;
    }
    if(password.value.length < 6) {
        error.value = 'Lozinka mora imati najmanje 6 znakova';
        return;
    }
    try {
        const response = await axios.post(import.meta.env.VITE_API_URL + 'api/users/registracija', 
            { ime: ime.value, prezime: prezime.value, email: email.value, password: password.value });
        localStorage.setItem('token', response.data.jwt_token);
        router.push('/')
    } catch(err) {
        error.value = err.response?.data?.poruka || 'Greška pri registraciji';
    }
}
</script>
<template>
    <div class="min-h-screen flex items-center justify-center px-4 py-12">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">Kreirajte račun</h1>
                <p class="text-gray-600">Ispunite podatke za registraciju</p>
            </div>
            <div class="flex items-center gap-4 mb-6">
                <div class="flex-1 h-px bg-gray-300"></div>
                <span class="text-sm text-gray-500">ili</span>
                <div class="flex-1 h-px bg-gray-300"></div>
            </div>
            <form @submit.prevent="registracija" class="space-y-4">
                <div>
                    <label for="ime" class="block text-sm font-medium text-gray-700 mb-2">
                        Ime
                    </label>
                    <input id="ime" v-model="ime" type="text" required placeholder="Ime..."
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"  />
                </div>

                <div>
                    <label for="prezime" class="block text-sm font-medium text-gray-700 mb-2">
                        Prezime
                    </label>
                    <input id="prezime" v-model="prezime" type="text" required placeholder="Prezime..."
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"  />
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        Email adresa
                    </label>
                    <input id="email" v-model="email" type="email" required placeholder="tekst@email.com"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"  />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        Lozinka
                    </label>
                    <input id="password" v-model="password" type="password" required placeholder="••••••••"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"  />
                    <p class="text-xs text-gray-500 mt-1">Minimalno 6 znakova</p>
                </div>

                <div>
                    <label for="potvrdaLozinke" class="block text-sm font-medium text-gray-700 mb-2">
                        Potvrdi lozinku
                    </label>
                    <input id="potvrdaLozinke" v-model="potvrdaLozinke" type="password" required placeholder="••••••••"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"  />
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition mt-6">
                    Registriraj se
                </button>
            </form>
            <div class="mt-6 text-center">
                <p class="text-gray-600">
                    Već imate račun?
                    <RouterLink to="/login" class="text-blue-600 font-semibold hover:text-blue-700 hover:underline ml-1">
                        Prijavite se
                    </RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>