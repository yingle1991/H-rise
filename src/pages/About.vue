<!-- @format -->

<template>
  <PreviewVditor :pdata="pdata" @callback="handleCallBack" />
</template>

<script>
import PreviewVditor from '@components/PreviewVditor'
import AboutHriseMd from '@config/aboutHrise'

export default {
  name: 'about-hrise',

  data() {
    return {
      isLoading: true,
      pdata: AboutHriseMd
    }
  },

  created() {},

  components: {
    PreviewVditor
  },

  mounted() {},

  methods: {
    handleCallBack() {
      this.isLoading = false
    }
  }
}
</script>
