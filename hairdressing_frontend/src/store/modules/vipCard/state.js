let state = {
    addNewVipCard: {
        cardType: null,
        cardKindId: null,
        cardKindInfo: null,
        onCardEdit: false,
        editCardId: null,
    },
    editVipCard: {
        currentListStatus: null,
        currentComponents: null, // 编辑时进入会员卡封面设置要激活的动态组件, 配合onCardEdit直接写死封面页面的组件也行
    },
    cardCoverType:0,
    cardCoverFromStorage:"",
    cardCoverUserDefined:""
}
export default state;
