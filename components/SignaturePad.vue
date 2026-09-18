<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);
const hasSignature = ref(false);

const getCoordinates = (e: MouseEvent | TouchEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  if ('touches' in e && e.touches.length > 0) {
    return {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top) * scaleY,
    };
  } else if ('clientX' in e) {
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }
  return { x: 0, y: 0 };
};

const startDrawing = (e: MouseEvent | TouchEvent) => {
  e.preventDefault();
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  isDrawing.value = true;
  hasSignature.value = true;

  const { x, y } = getCoordinates(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const draw = (e: MouseEvent | TouchEvent) => {
  if (!isDrawing.value) return;
  e.preventDefault();

  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { x, y } = getCoordinates(e);
  ctx.lineTo(x, y);
  ctx.strokeStyle = '#0f172a'; // Tinta biru-hitam elegan
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
};

const stopDrawing = () => {
  if (!isDrawing.value) return;
  isDrawing.value = false;

  const canvas = canvasRef.value;
  if (!canvas) return;

  const dataUrl = canvas.toDataURL('image/png');
  emit('update:modelValue', dataUrl);
};

const clearCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hasSignature.value = false;
  emit('update:modelValue', '');
};

const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  // Set internal resolution
  canvas.width = 400;
  canvas.height = 160;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Jika sudah ada data tanda tangan awal
  if (props.modelValue) {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      hasSignature.value = true;
    };
    img.src = props.modelValue;
  }
};

onMounted(() => {
  initCanvas();
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal && canvasRef.value) {
      clearCanvas();
    }
  }
);
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-1.5">
      <label class="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
        <Icon name="ph:signature-bold" class="w-4 h-4 text-brand-600" />
        Tanda Tangan Digital
      </label>
      <button
        v-if="hasSignature"
        type="button"
        @click="clearCanvas"
        class="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-rose-50"
      >
        <Icon name="ph:trash-bold" class="w-3.5 h-3.5" />
        Hapus Coretan
      </button>
    </div>

    <div class="relative w-full rounded-xl border border-slate-200 bg-white overflow-hidden shadow-inner touch-none">
      <canvas
        ref="canvasRef"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart.passive="false"
        @touchstart="startDrawing"
        @touchmove.passive="false"
        @touchmove="draw"
        @touchend="stopDrawing"
        class="w-full h-36 cursor-crosshair bg-white"
      ></canvas>

      <div
        v-if="!hasSignature"
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs"
      >
        <Icon name="ph:pencil-line-light" class="w-6 h-6 mb-1 opacity-60" />
        <span>Goreskan tanda tangan di sini (Layar sentuh / Mouse)</span>
      </div>
    </div>
  </div>
</template>
