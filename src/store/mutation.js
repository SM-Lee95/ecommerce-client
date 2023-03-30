export default {
  setEditorHTML(state, payload) {
    state.EditorHTML = payload;
  },
  setSizeList(state, payload) {
    state.SizeList = payload;
  },
  setColorList(state, payload) {
    state.ColorList = payload;
  },
  setCateList(state, payload) {
    state.CateList = payload;
  },
  setProcList(state, payload) {
    state.ProcList = payload;
  },
  setMenuList(state, payload) {
    state.MenuList = payload;
  },
  setDeliList(state, payload) {
    state.DeliList = payload;
  },
  setBankList(state, payload) {
    state.BankList = payload;
  },
  setMailAuthTy(state, payload){
    state.MailAuthTy = payload;
  },
  setAnswerWriteInfo(state, payload){
    state.AnswerWriteInfo = payload;
  },
  setQnaList(state, payload){
    state.QnaList = payload;
  },
  setSelectedMenu(state, payload){
    state.SelectedMenu = payload;
  }
};
