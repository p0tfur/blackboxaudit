<template>
  <div
    ref="containerRef"
    class="virtual-list-container"
    @scroll="handleScroll"
  >
    <div
      class="virtual-list-phantom"
      :style="{ height: `${listHeight}px` }"
    >
      <div
        class="virtual-list-content"
        :style="{ transform: `translateY(${startOffset}px)` }"
      >
        <slot
          v-for="item in visibleData"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, onUnmounted, defineComponent, type PropType, type Ref, type ComputedRef } from 'vue'

interface VirtualListItem {
  id: string | number
  [key: string]: any
}

export default defineComponent({
  name: 'VirtualList',
  props: {
    data: {
      type: Array as PropType<VirtualListItem[]>,
      required: true
    },
    itemHeight: {
      type: Number,
      required: true
    },
    bufferSize: {
      type: Number,
      default: 5
    }
  },
  setup(props) {
    const containerRef = ref<HTMLElement | null>(null)
    const scrollTop = ref(0)
    const containerHeight = ref(0)

    const listHeight = computed(() => props.data.length * props.itemHeight)
    const visibleCount = computed(() => Math.ceil(containerHeight.value / props.itemHeight))

    const startIndex = computed(() => {
      const index = Math.floor(scrollTop.value / props.itemHeight)
      return Math.max(0, index - props.bufferSize)
    })

    const endIndex = computed(() => {
      const index = startIndex.value + visibleCount.value + props.bufferSize * 2
      return Math.min(index, props.data.length)
    })

    const startOffset = computed(() => startIndex.value * props.itemHeight)

    const visibleData: ComputedRef<VirtualListItem[]> = computed(() => {
      return props.data.slice(startIndex.value, endIndex.value)
    })

    const handleScroll = () => {
      if (containerRef.value) {
        scrollTop.value = containerRef.value.scrollTop
      }
    }

    const updateContainerHeight = () => {
      if (containerRef.value) {
        containerHeight.value = containerRef.value.clientHeight
      }
    }

    const resizeObserver = new ResizeObserver(updateContainerHeight)

    onMounted(() => {
      if (containerRef.value) {
        resizeObserver.observe(containerRef.value)
        updateContainerHeight()
      }
    })

    onUnmounted(() => {
      if (containerRef.value) {
        resizeObserver.unobserve(containerRef.value)
      }
    })

    return {
      containerRef,
      listHeight,
      startOffset,
      visibleData,
      handleScroll
    }
  }
})
</script>

<style scoped>
.virtual-list-container {
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.virtual-list-phantom {
  position: relative;
  width: 100%;
}

.virtual-list-content {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
</style>