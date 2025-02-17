<script setup>
import SearchId from './components/SearchId.vue'
</script>

<template>
    <div class="min-h-screen bg-accent py-12">
        <div class="container mx-auto px-4">
            <h1 class="text-4xl font-bold text-center text-primary mb-8">Birthday Events Finder</h1>
            <p class="text-center text-secondary mb-12 max-w-2xl mx-auto">
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