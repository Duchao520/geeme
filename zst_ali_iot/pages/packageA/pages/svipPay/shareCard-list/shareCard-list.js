Component({
  mixins: [],
  data: {},
  props: {
    onCloseShareCardList: () => console.error('not find'),
    onChooseShareCard : () => console.error('not find'),
    SHARE_CARD_LIST: ''
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    close(){
      this.props.onCloseShareCardList();
    },
    chooseShareCard(event){
      var {sharecardId} = event.target.dataset;
      this.props.onChooseShareCard(sharecardId);
      this.close();
    }
  },
});
