// 商品分类小仓库
import { defineStore } from 'pinia'
import { reqC1,reqC2,reqC3 } from '@/api/product/attr';
import { categoryRes,attrRes } from '@/api/product/attr/type'

interface cateState {
  c1Data: categoryRes[]
  c2Data: categoryRes[]
  c3Data: categoryRes[]
  c1Id: string | number
  c2Id: string | number
  c3Id: string | number
  attrList: attrRes[]
}

export default defineStore('category',{
  state: ():cateState => {
    return {
      c1Data: [], //一级分类数据
      c2Data: [], //二级分类数据
      c3Data: [], //三级分类数据
      c1Id: '',//一级分类id
      c2Id: '',//二级分类id
      c3Id: '',//三级分类id
      attrList: [], // 属性列表
    }
  },
  actions: {
    getC1() {
      reqC1().then(res => {
        if(res.code === 200) {
          this.c1Data = res.data
        }
      })
    },
    getC2() {
      reqC2(this.c1Id).then(res => {
        if(res.code === 200) {
          this.c2Data = res.data
        }
      })
    },
    getC3() {
      reqC3(this.c2Id).then(res => {
        if(res.code === 200) {
          this.c3Data = res.data
        }
      })
    },
  }
})