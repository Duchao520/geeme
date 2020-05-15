// components/comments/comments.js
Component({
  lifetimes:{
    attached(){
    }
  },
  properties: {
    list:Array
  },
  data: {

  },
  methods: {
    jumpEvaluationDetail(e){
      this.$route('/pages/RC/pages/evaluationDetail/evaluationDetail', {id:e.currentTarget.dataset.id})
    },
  }
})
