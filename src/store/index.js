import { createStore, createLogger } from 'vuex'

import state from "@/store/state"
import mutations from "@/store/mutations"
import * as getters from "@/store/getters"
import * as actions from "@/store/actions"
//开发环境
const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
