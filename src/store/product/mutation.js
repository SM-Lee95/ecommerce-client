export default {
  setPagination(state, payload) {
    state.Pagination = payload;
    state.Pagination.number += 1;
  },
  setSelectMenuCd(state, payload) {
    state.selectMenuCd = payload;
  },
  setJJimList(state, payload) {
    state.JJimList = payload;
  },
  setDetailInfo(state, payload) {
    state.DetailInfo = payload;
  },
  setBasketList(state, payload) {
    var midSum = 0;
    var endSum = 0;
    payload.forEach(function (node) {
      midSum = 0;
      node.isSelected = true;
      node.detail.forEach(function (detail) {
        midSum +=
          node.salesPri * ((100 - node.discountRate) / 100) * detail.basketCnt;
      });
      node.midSum = midSum;
      endSum += midSum;
    });
    payload.endSum = endSum;
    state.BasketList = payload;
  },
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
  setMenuList(state, payload) {
    state.MenuList = payload;
  },
  setProductList(state, payload) {
    state.ProductList = payload;
  },
};
