import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

export const useLocalStorage = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  const value = ref(stored ? JSON.parse(stored) : defaultValue);
  
  watch(value, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal));
  }, { deep: true });
  
  return value;
};

export const useDebounce = (value, delay = 300) => {
  const debounced = ref(value.value);
  let timeout;
  
  watch(value, (newVal) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debounced.value = newVal;
    }, delay);
  });
  
  return debounced;
};

export const useWindowSize = () => {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);
  
  const handler = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };
  
  onMounted(() => window.addEventListener('resize', handler));
  onUnmounted(() => window.removeEventListener('resize', handler));
  
  return { width, height };
};

export const useFetch = (url) => {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(true);
  
  const fetchData = async () => {
    loading.value = true;
    try {
      const res = await fetch(url);
      data.value = await res.json();
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(fetchData);
  
  return { data, error, loading, refetch: fetchData };
};

export default { useLocalStorage, useDebounce, useWindowSize, useFetch };