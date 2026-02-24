import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseurl = import.meta.env.VITE_BASE_URL;

/* ==============================
   FETCH FICTION BOOKS
================================ */
export const fetchurl = createAsyncThunk(
  "bookdata/fetchurl",
  async (startIndex = 0, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${baseurl}/api/book/fiction?startIndex=${startIndex}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Backend fetch failed");
      }

      return {
        items: await response.json(),
        startIndex
      };

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


/* ==============================
   SEARCH BOOKS
================================ */
export const fetchByBookAndAuthor = createAsyncThunk(
  "bookdata/fetchByBookAndAuthor",
  async ({ searchTerm, startIndex = 0 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${baseurl}/api/book/search?searchTerm=${encodeURIComponent(
          searchTerm
        )}&startIndex=${startIndex}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Search failed");
      }

      return {
        items: await response.json(),
        startIndex
      };

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


/* ==============================
   SLICE
================================ */
const dataSlice = createSlice({
  name: "bookdata",
  initialState: {
    data: [],
    isError: false,
    isLoading: false,
    errorMessage: ""
  },
  reducers: {
    clearBooks: (state) => {
      state.data = [];
    }
  },
  extraReducers: (builder) => {
    builder

      /* ========= FICTION ========= */
      .addCase(fetchurl.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })

      .addCase(fetchurl.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        const { items, startIndex } = action.payload;

        if (startIndex === 0) {
          // Fresh load
          state.data = items;
        } else {
          // Load more
          const combined = [...state.data, ...items];
          state.data = Array.from(
            new Map(combined.map(item => [item.id, item])).values()
          );
        }
      })

      .addCase(fetchurl.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })


      /* ========= SEARCH ========= */
      .addCase(fetchByBookAndAuthor.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })

      .addCase(fetchByBookAndAuthor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        const { items, startIndex } = action.payload;

        if (startIndex === 0) {
          // Fresh search
          state.data = items;
        } else {
          // Load more search
          const combined = [...state.data, ...items];
          state.data = Array.from(
            new Map(combined.map(item => [item.id, item])).values()
          );
        }
      })

      .addCase(fetchByBookAndAuthor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  }
});

export const { clearBooks } = dataSlice.actions;
export default dataSlice.reducer;