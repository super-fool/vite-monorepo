<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#icon-hugo_${icon}`"></use>
  </svg>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    click: Function,
    icon: {
      type: String,
      default: "",
      required: true,
    },
  },
};
</script>

<style>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  margin: 0 4px;
}
</style>