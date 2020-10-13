export default {
  addCounter(state,payload){
    payload.count++
  },
  addTocart(state,payload){
    payload.checked=true
    state.carList.push(payload)
  }
}
