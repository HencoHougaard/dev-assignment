<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
    <button 
        :class="[
            'px-4 py-2 font-semibold rounded-md shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50',
            disabled ? 
                'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300' : 
                'bg-primary text-accent hover:bg-secondary hover:text-primary focus:ring-primary'
        ]"
        :disabled="disabled"
    >
        <slot />
    </button>
</template>