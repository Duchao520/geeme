// components/common/EvaluationList/EvaluationList.js
Component({
  properties: {
    list: Array,
  },
  data: {
    
  },
  methods: {
    toevaluationDetail(e) {
      this.$route('/pages/UIC/pages/evaluationDetail/evaluationDetail', {id:e.currentTarget.dataset.id})
    },
  }
})