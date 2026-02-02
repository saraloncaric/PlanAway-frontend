import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import TripsView from "@/views/TripsView.vue";
import WishlistView from "@/views/WishlistView.vue";
import ToDoView from "@/views/ToDoView.vue";
import LoginView from "@/views/LoginView.vue";
import RegistracijaView from "@/views/RegistracijaView.vue";
import TripView from "@/views/TripView.vue";

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
            path: '/trips/:naslov',
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
        }
    ]
})
export default router