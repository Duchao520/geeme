// components/App/AppServiceTree/AppServiceTree.js
Component({
  options: {
    styleIsolation: "apply-shared",
  },
  lifetimes:{
    attached(){
      // 检查是否有已选中的服务
      this.serviceArr = this.serviceArr || []
      for (const type of this.data.list) {
        for (const service of type.serviceList) {
          if (service.selected == 1) {
            this.serviceArr.push(service)
          }
        }
      }
      this.triggerEvent('updateService', this.serviceArr)
    }
  },
  properties: {
    list: Array
  },
  data: {
    popup: false,
    selectedService: null,
    selectedSpecification: null,
  },
  methods: {
    selectService(e) {
      const service = e.currentTarget.dataset.item
      const specification = service.selectedSpecification || service.packageList[0]
      this.setData({
        popup: true,
        selectedService: service,
        selectedSpecification: specification
      })
    },
    cancelService(e){
      if(e.currentTarget.dataset.item.selected == 0){
        this.selectService(e)
      }else{
        outer:
        for (const type of this.data.list) {
          for (const service of type.serviceList) {
            if (service.id == e.currentTarget.dataset.item.id) {
              service.selected = 0
              this.removeService(service.id)
              break outer;
            }
          }
        }
        this.setData({
          list:this.data.list
        })
      }
    },
    selectSpecification(e) {
      this.setData({
        selectedSpecification: e.currentTarget.dataset.item
      })
    },
    changeAmount(e) {
      this.setData({
        'selectedSpecification.count': e.detail
      })
    },
    confirm() {
      const selectedSpecification = this.data.selectedSpecification
      outer:
        for (const type of this.data.list) {
          for (const service of type.serviceList) {
            for (const specification of service.packageList) {
              if (specification.id == selectedSpecification.id) {
                service.selected = 1
                service.selectedSpecification = selectedSpecification
                service.selectedSpecification.count = selectedSpecification.count
                this.addService(service)
                break outer;
              }
            }
          }
        }
      this.setData({
        popup: false,
        list:this.data.list
      })
    },
    addService(service){
      this.serviceArr = this.serviceArr || []

      // 若已经有该服务，则对做出的改动直接发送事件就好
      for(const v of this.serviceArr){
        if(v.id == service.id){
          return this.triggerEvent('updateService', this.serviceArr)
        }
      }

      this.serviceArr.push(service)
      this.triggerEvent('updateService', this.serviceArr)
    },
    removeService(id){
      for(let i = 0; i < this.serviceArr.length; i++){
        if(this.serviceArr[i].id == id){
          this.serviceArr.splice(i, 1)
          break;
        }
      }
      this.triggerEvent('updateService', this.serviceArr)
    },
    prevent() {}
  }
})