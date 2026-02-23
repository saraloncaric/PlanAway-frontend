<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const putovanje = ref(null);
const agencija = ref(null);
const uređivanje = ref(false);
const spremanje = ref(false);
const brojOsoba = ref(1);
const slanjeUpita = ref(false);
const upit = ref('');

const jeAgencija = ref(false);

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
    ostale_slike: [],
    ukljuceno: [],
    nije_ukljuceno: [],
    vazne_informacije: ''
});
const provjeraAgencije = async() => {
    const token = localStorage.getItem('token');
    if(!token || !putovanje.value || !agencija.value) {
        return false;
    }
    const user_response = await axios.get('/api/users/ime', {
        headers: { Authorization : `Bearer ${token}` }
    });
    return user_response.data.user_type === 'agencija' && 
        putovanje.value.agencija_id === agencija.value.agencija_id &&
        agencija.value.user_id === user_response.data.user_id;
}
const dohvatiPutovanje = async() => {
    try {
        const putovanje_id = route.params.id;
        const response = await axios.get(`/api/putovanja/${putovanje_id}`);
        putovanje.value = response.data;

        const agencija_response = await axios.get(`/api/agencije/${putovanje.value.agencija_id}`);
        agencija.value = agencija_response.data;

        jeAgencija.value = await provjeraAgencije();

        forma.value = {
            naslov: putovanje.value.naslov || '',
            opis: putovanje.value.opis || '',
            detaljni_opis: putovanje.value.detaljni_opis || '',
            destinacija: putovanje.value.destinacija || '',
            drzava: putovanje.value.drzava || '',
            cijena: putovanje.value.cijena || '',
            broj_dana: putovanje.value.broj_dana || '',
            broj_noci: putovanje.value.broj_noci || '',
            broj_ljudi: putovanje.value.broj_ljudi || '',
            start_date: putovanje.value.start_date?.split('T')[0] || '',
            end_date: putovanje.value.end_date?.split('T')[0] || '',
            plan_putovanja: putovanje.value.plan_putovanja || '',
            image: putovanje.value.image || '',
            ostale_slike: putovanje.value.ostale_slike || [],
            ukljuceno: putovanje.value.ukljuceno || [],
            nije_ukljuceno: putovanje.value.nije_ukljuceno || [],
            vazne_informacije: putovanje.value.vazne_informacije || ''
        }
    } catch(err) {
        console.error('Greška pri dohvaćanju putovanja', err);
    }
}
const promjene = async() => {
    spremanje.value = true;
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`/api/putovanja/${putovanje.value.putovanje_id}`, 
            forma.value,
            { headers: { Authorization: `Bearer ${token}`}}
        )
        putovanje.value = response.data.putovanje;
        uređivanje.value = false;
    } catch(err) {
        console.error('Greška pri ažuriranju', err);
    } finally {
        spremanje.value = false;
    }
}
const otkaziPromjene = () => {
    forma.value = {
        naslov: putovanje.value.naslov,
        opis: putovanje.value.opis,
        detaljni_opis: putovanje.value.detaljni_opis,
        destinacija: putovanje.value.destinacija,
        drzava: putovanje.value.drzava,
        cijena: putovanje.value.cijena,
        broj_dana: putovanje.value.broj_dana,
        broj_noci: putovanje.value.broj_noci,
        broj_ljudi: putovanje.value.broj_ljudi,
        start_date: putovanje.value.start_date?.split('T')[0],
        end_date: putovanje.value.end_date?.split('T')[0],
        plan_putovanja: putovanje.value.plan_putovanja,
        image: putovanje.value.image,
        ostale_slike: putovanje.value.ostale_slike,
        ukljuceno: putovanje.value.ukljuceno,
        nije_ukljuceno: putovanje.value.nije_ukljuceno,
        vazne_informacije: putovanje.value.vazne_informacije
    }
    uređivanje.value = false;
}
const parseArray = (array) => {
    if (Array.isArray(array)) return array;
    if (!array) return [];
    if (typeof array === 'string') {
        return array.replace(/[{}]/g, '').split(',').map(s => s.trim().replace(/"/g, ''));
    }
    return [];
}
const formatDatum = (datum) => {
    if (!datum) return '';
    return new Date(datum).toLocaleDateString('hr-HR');
};
const posaljiUpit = async() => {
    const token = localStorage.getItem('token');
    if(!token) {
        router.push('/login');
        return;
    }
    slanjeUpita.value = true;
    upit.value = '';
    try {
        await axios.post('/api/upiti', 
        {
            putovanje_id: putovanje.value.putovanje_id,
            broj_ljudi: brojOsoba.value
        }, {
            headers: { Authorization: `Bearer ${token}`}
        })
        upit.value = 'Upit uspješno poslan!'
    } catch(err) {
        console.error('Greška pri slanju upita', err);
    } finally {
        slanjeUpita.value = false;

    }
}
onMounted(() => {
    dohvatiPutovanje();
})
</script>
<template>
    <div class="min-h-screen bg-gray-50 pt-3 pb-10">
        <div v-if="putovanje" class="max-w-6xl mx-auto px-6">
            <button @click="router.back()" class="mb-4 text-blue-600 hover:text-blue-800 glex items-center gap-2">
                Natrag
            </button>
            <div class="mb-6">
                <img v-if="!uređivanje" :src="putovanje.image" :alt="putovanje.naslov" 
                    class="w-full h-96 object-cover rounded-2xl shadow" 
                />
                <div v-else>
                    <label class="block text-sm font-medium text-gray-700 mb-2">URL glavne slike</label>
                    <input 
                        v-model="forma.image"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="https://..."
                    />
                </div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div class="flex-1">
                        <h1 v-if="!uređivanje" class="text-3xl font-bold text-gray-800 mb-2">
                            {{ putovanje.destinacija }}, {{ putovanje.drzava }}
                        </h1>
                        <div v-else class="space-y-3">
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Destinacija</label>
                                    <input v-model="forma.destinacija" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Država</label>
                                    <input v-model="forma.drzava" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                                </div>
                            </div>
                        </div>
                        <p v-if="!uređivanje" class="text-gray-600">{{ putovanje.broj_dana }} dana/{{ putovanje.broj_noci }} noći</p>
                        <div v-else class="grid grid-cols-2 gap-3 mt-2">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Broj dana</label>
                                <input v-model.number="forma.broj_dana" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Broj noći</label>
                                <input v-model.number="forma.broj_noci" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col items-end gap-3">
                        <div v-if="!uređivanje" class="text-right">
                            <div class="text-4xl font-bold text-green-600">{{ putovanje.cijena }}€</div>
                            <div class="text-sm text-gray-500">po osobi</div>
                        </div>
                        <div v-else>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Cijena (€)</label>
                            <input v-model.number="forma.cijena" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div v-if="jeAgencija" class="flex gap-2">
                            <div v-if="!uređivanje">
                                <button @click="uređivanje=true" class="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-4 py-2 rounded-lg transition">
                                    Uredi putovanje
                                </button>
                            </div>
                            <div v-else class="flex gap-2">
                                <button @click="promjene" :disabled="spremanje"
                                    class="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition disabled:opacity-50">
                                    {{ spremanje ? 'Spremanje' : 'Spremi'}}
                                </button>
                                <button @click="otkaziPromjene" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition">
                                    Odustani
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-wrap gap-3">
                    <span class="bg-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-full">
                        {{ formatDatum(putovanje.start_date) }}
                    </span>
                    <span class="bg-purple-100 text-purple-700 text-sm font-medium px-4 py-2 rounded-full">
                        Broj osoba: {{ putovanje.broj_ljudi }}
                    </span>
                    <span v-if="putovanje.vazne_informacije" class="bg-yellow-100 text-yellow-700 text-sm font-medium px-4 py-2 rounded-full">
                        Važne informacije
                    </span>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-white rounded-2xl shadow-sm p-6">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">O putovanju</h2>
                        <p v-if="!uređivanje" class="text-gray-800 leading-relaxed whitespace-pre-line">
                            {{ putovanje.detaljni_opis || putovanje.opis }}
                        </p>
                        <textarea v-else v-model="forma.detaljni_opis" rows="6"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Detaljni opis putovanja..." 
                        />
                    </div>
                    <div v-if="putovanje.plan_putovanja" class="bg-white rounded-2xl shadow-sm p-6">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Detaljni plan putovanja</h2>
                        <div v-if="!uređivanje" class="space-y-4">
                            <div v-for="(dan, index) in putovanje.plan_putovanja.split('\n')" 
                                :key="index"
                                class="border-l-4 border-blue-400 pl-4 py-2">
                                <p class="text-gray-700">{{ dan }}</p>
                            </div>
                        </div>
                        <textarea v-else v-model="forma.plan_putovanja" rows="8"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Dan 1: ..."
                        />
                    </div>
                    <div v-if="parseArray(putovanje.ostale_slike).length > 0" class="bg-white rounded-2xl shadow-sm p-6">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Galerija</h2>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <img 
                                v-for="(slika, index) in parseArray(putovanje.ostale_slike)" 
                                :key="index"
                                :src="slika" 
                                :alt="`Slika ${index + 1}`"
                                class="w-full h-48 object-cover rounded-lg shadow"
                            />
                        </div>
                    </div>
                    <div v-if="agencija" class="bg-white rounded-2xl shadow-sm p-6">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Agencija</h2>
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 rounded-full bg-blue-400 flex items-center justify-center">
                                <span class="text-white text-xl font-bold">
                                    {{ agencija.naziv_agencije?.substring(0, 2).toUpperCase() }}
                                </span>
                            </div>
                            <div>
                                <RouterLink :to="`/profil/${agencija.agencija_id}`">
                                    <h3 class="font-bold text-lg">{{ agencija.naziv_agencije }}</h3>
                                </RouterLink>
                                <p class="text-sm text-gray-600">{{ agencija.kontakt_email }}</p>
                                <p class="text-sm text-gray-600">{{ agencija.kontakt_broj }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-6">
                    <div v-if="!jeAgencija" class="bg-white rounded-2xl shadow-sm p-6 top-20">
                        <h3 class="text-xl font-bold text-gray-800 mb-4">Pošalji upit</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Datum polaska</label>
                                <input type="date" :value="putovanje.start_date?.split('T')[0]"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg" readonly
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Broj osoba</label>
                                <select v-model="brojOsoba" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4+</option>
                                </select>
                            </div>
                            <button @click="posaljiUpit" :disabled="slanjeUpita" class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition">
                                Pošalji upit
                            </button>
                            <div v-if="upit" class="p-3 rounded-lg text-sm text-center" 
                                :class="upit.includes('uspješno') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
                                {{ upit }}
                            </div>
                            <p class="text-xs text-center text-gray-500">
                                Besplatno otkazivanje do 14 dana prije polaska
                            </p>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">Što je uključeno</h3>
                        <ul v-if="!uređivanje" class="space-y-2">
                            <li v-for="(stavka, index) in parseArray(putovanje.ukljuceno)" 
                                :key="index"
                                class="flex items-start gap-2">
                                <span class="text-green-500">✓</span>
                                <span class="text-gray-700">{{ stavka }}</span>
                            </li>
                        </ul>
                        <textarea v-else v-model="forma.ukljuceno" rows="4"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder='["Smještaj", "Doručak"]'
                        />
                    </div>
                    <div class="bg-white rounded-2xl shadow-sm p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-4">Nije uključeno</h3>
                        <ul v-if="!uređivanje" class="space-y-2">
                            <li v-for="(stavka, index) in parseArray(putovanje.nije_ukljuceno)" 
                                :key="index"
                                class="flex items-start gap-2">
                                <span class="text-red-500">✗</span>
                                <span class="text-gray-700">{{ stavka }}</span>
                            </li>
                        </ul>
                        <textarea v-else v-model="forma.nije_ukljuceno" rows="4"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder='["Ručak", "Večera"]'
                        />
                    </div>
                    <div v-if="putovanje.vazne_informacije" class="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6">
                        <h3 class="text-lg font-bold text-gray-800 mb-2">Važne informacije</h3>
                        <p v-if="!uređivanje" class="text-gray-700">{{ putovanje.vazne_informacije }}</p>
                        <input v-else v-model="forma.vazne_informacije" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Potrebna putovnica..."
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>