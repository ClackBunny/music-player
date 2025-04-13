import { defineStore } from "pinia";
import { ref } from "vue";

export const useSeverLoadingStore = defineStore('serverLoading', () => {
    const loading = ref(false)

    function isLoading(value: boolean) {
        loading.value = value;
    }

    return {loading, isLoading};
})