<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const spremanje = ref(false);

const forma = ref({
    naslov: '',
    opis: '',
    detaljni_opis: '',
    destinacija: '',
    drzava: '',
    cijena: '',
    broj_dana: '',
    broj_noci: '',
    broj_ljudi: '',
    start_date: '',
    end_date: '',
    plan_putovanja: '',
    image: '',
    ostale_slike: '',
    ukljuceno: '',
    nije_ukljuceno: '',
    vazne_informacije: ''
});
const dodajPutovanje = async() => {
    spremanje.value = true;
    try {
        const token = localStorage.getItem('token');
        const user_response = await axios.get(import.meta.env.VITE_API_URL + '/api/users/ime', {
            headers: {Authorization: `Bearer ${token}` }
        })
        const agencija_response = await axios.get(import.meta.env.VITE_API_URL + '/api/agencije');
        const agencija = agencija_response.data.find(a => a.user_id === user_response.data.user_id);
        if(!agencija) {
            console.error('Agencija nije pronađena', err);
            return;
        }
        const podaci = {
            agencija_id: agencija.agencija_id,
            naslov: forma.value.naslov,
            opis: forma.value.opis,
            detaljni_opis: forma.value.detaljni_opis,
            destinacija: forma.value.destinacija,
            drzava: forma.value.drzava,
            cijena: parseFloat(forma.value.cijena),
            broj_dana: parseInt(forma.value.broj_dana),
            broj_noci: parseInt(forma.value.broj_noci),
            broj_ljudi: parseInt(forma.value.broj_ljudi),
            start_date: forma.value.start_date,
            end_date: forma.value.end_date,
            plan_putovanja: forma.value.plan_putovanja,
            image: forma.value.image,
            ostale_slike: forma.value.ostale_slike ? forma.value.ostale_slike.split(',').map(s => s.trim()) : [],
            ukljuceno: forma.value.ukljuceno ? forma.value.ukljuceno.split(',').map(s => s.trim()) : [],
            nije_ukljuceno: forma.value.nije_ukljuceno ? forma.value.nije_ukljuceno.split(',').map(s => s.trim()) : [],
            vazne_informacije: forma.value.vazne_informacije
        }
        await axios.post(import.meta.env.VITE_API_URL + `/api/putovanja`, 
            podaci,
            { headers: { Authorization: `Bearer ${token}` }}
        )
        router.push('/agencijap')
    } catch(err) {
        console.error('Greška pri dodavanju putovanja', err);
    } finally {
        spremanje.value = false;
    }
}
</script>
<template>
    <div class="min-h-screen bg-gray-50 pb-10">
        <div class="max-w-4xl mx-auto px-6">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-3xl font-bold text-gray-800">Dodaj novo putovanje</h1>
                <button @click="router.push('/agencijap')"
                    class="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    Natrag na popis
                </button>
            </div>
            <form @submit.prevent="dodajPutovanje" class="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <div class="border-b pb-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">Osnovni podaci</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Naslov</label>
                            <input v-model="forma.naslov" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Naslov putovanja"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Destinacija</label>
                            <input v-model="forma.destinacija" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Grad/ovi"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Država</label>
                            <input v-model="forma.drzava" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Država"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Cijena (€)</label>
                            <input v-model="forma.cijena" type="number" step="0.01" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="cijena"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Broj ljudi</label>
                            <input v-model="forma.broj_ljudi" type="number"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="20"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Broj dana</label>
                            <input v-model="forma.broj_dana" type="number" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="5"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Broj noći</label>
                            <input v-model="forma.broj_noci" type="number"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="4"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Datum polaska</label>
                            <input v-model="forma.start_date" type="date" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Datum povratka</label>
                            <input v-model="forma.end_date" type="date"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                </div>
                <div class="border-b pb-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">Opisi</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Kratak opis</label>
                            <textarea v-model="forma.opis" rows="3"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Kratki opis putovanja"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Detaljan opis</label>
                            <textarea v-model="forma.detaljni_opis" rows="5"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Detaljnije o putovanju..."
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Plan putovanja (svaki dan u novom redu)</label>
                            <textarea v-model="forma.plan_putovanja" rows="6"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                </div>
                <div class="border-b pb-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">Slike</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">URL glavne slike</label>
                            <input v-model="forma.image" 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Ostale slike (odvojene zarezom)
                            </label>
                            <textarea v-model="forma.ostale_slike" rows="3"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                            />
                            <p class="text-xs text-gray-500 mt-1">Svaki URL odvojite zarezom</p>
                        </div>
                    </div>
                </div>
                <div class="border-b pb-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">Što je uključeno u cijenu</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Uključeno (odvojeno zarezom)
                            </label>
                            <textarea v-model="forma.ukljuceno" rows="4"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Što je uključeno u cijenu"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Nije uključeno (odvojeno zarezom)
                            </label>
                            <textarea v-model="forma.nije_ukljuceno" rows="4"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Što nije u cijeni"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <h2 class="text-xl font-bold text-gray-800 mb-4">Važne informacije</h2>
                    <input v-model="forma.vazne_informacije" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Potrebna putovnica (Brexit)"
                    />
                </div>
                <div class="flex gap-3 pt-6">
                    <button type="submit" :disabled="spremanje"
                        class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
                        {{ spremanje ? 'Spremanje...' : 'Dodaj putovanje' }}
                    </button>
                    <button type="button" @click="router.push('/agencijap')"
                        class="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition">
                        Odustani
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>