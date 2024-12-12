import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Brand } from "../../app/types"
import type { RootState } from "../../app/store"

interface UiState {
  brand: Brand
}

const initialState: UiState = { brand: 'mc_nj' }

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    brandChanged: (state, action: PayloadAction<Brand>) => {
      state.brand = action.payload
    },
  },
})

export const { brandChanged } = uiSlice.actions
export default uiSlice.reducer

export const selectCurrentBrand = (state: RootState) => state.ui.brand
