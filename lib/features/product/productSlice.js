import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ storeId, search, category }, thunkAPI) => {
    try {
      const params = {}

      if (storeId) params.storeId = storeId
      if (search) params.search = search
      if (category) params.category = category // ✅ ADD THIS

      const { data } = await axios.get("/api/products", { params })
      
      return data.products
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data)
    }
  }
)

const productSlice = createSlice({
  name: "product",
  initialState: {
    list: [],
  },
  reducers: {
    setProduct: (state, action) => {
      state.list = action.payload
    },
    clearProduct: state => {
      state.list = []
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.list = action.payload
    })
  },
})

export const { setProduct, clearProduct } = productSlice.actions
export default productSlice.reducer
