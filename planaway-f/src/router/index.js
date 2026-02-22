import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import TripsView from "@/views/TripsView.vue";
import WishlistView from "@/views/WishlistView.vue";
import ToDoView from "@/views/ToDoView.vue";
import LoginView from "@/views/LoginView.vue";
import RegistracijaView from "@/views/RegistracijaView.vue";
import TripView from "@/views/TripView.vue";
import AUpitiView from "@/views/AUpitiView.vue";
import ProfilAgencijeView from "@/views/ProfilAgencijeView.vue";
import AgencijaPutovanjaView from "@/views/AgencijaPutovanjaView.vue";
import NovoPutovanjeView from "@/views/NovoPutovanjeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/registracija',
            name: 'registracija',
            component: RegistracijaView
        },
        {
            path: '/trips',
            name: 'trips',
            component: TripsView
        },
        {
            path: '/trips/:id',
            name: 'trip',
            component: TripView
        },
        {
            path: '/wishlist',
            name: 'wishlist',
            component: WishlistView
        },
        {
            path: '/todo',
            name: 'todo',
            component: ToDoView
        },
        {
            path: '/upiti',
            name: 'upiti',
            component: AUpitiView
        },
        {
            path: '/profil',
            name: 'profil-agencija',
            component: ProfilAgencijeView
        },
        {
            path: '/profil/:id',
            name: 'profil',
            component: ProfilAgencijeView
        },
        {
            path: '/agencijap',
            name: 'Aputovanja',
            component: AgencijaPutovanjaView
        },
        {
            path: '/novoputovanje',
            name: 'novoputovanje',
            component: NovoPutovanjeView
        }
    ]
})
export default router