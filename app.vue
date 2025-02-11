<script setup>
import { ref } from 'vue'
import SearchId from './components/SearchId.vue'
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12">
        <div class="container mx-auto px-4">
            <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Birthday Events Finder</h1>
            <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Discover what special holidays and events occur on your birthday! Enter your South African ID number below to find out.
            </p>
            <SearchId />
        </div>
    </div>
</template>

<style>
body {
    margin: 0;
    padding: 0;
}
</style>