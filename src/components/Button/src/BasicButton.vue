<template>
  <Button v-bind="getBindValue" :class="[getColor, $attrs.class]">
    <template #default="data">
      <slot v-bind="data" />
    </template>
  </Button>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';

  import { Button } from 'ant-design-vue';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'AButton',
    inheritAttrs: false,
    components: { Button },
    props: {
      type: propTypes.oneOf(['primary', 'default', 'danger', 'dashed', 'link']).def('default'),
      color: propTypes.oneOf(['error', 'warning', 'success', '']),
      loading: propTypes.bool,
      disabled: propTypes.bool,
      preIcon: propTypes.string,
      postIcon: propTypes.string,
    },
    setup(props, { attrs }) {
      const getColor = computed(() => {
        const { color, disabled } = props;
        return {
          [`ant-btn-${color}`]: !!color,
          [`is-disabled`]: disabled,
        };
      });

      const getBindValue = computed((): any => {
        return { ...attrs, ...props };
      });

      return { getBindValue, getColor };
    },
  });
</script>
