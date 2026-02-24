import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchurl = createAsyncThunk('bookdata/fetchurl', async (startIndex = 0, { rejectWithValue }) => {
    try {
        const apiKey = import.meta.env.VITE_GOOGLE_BOOK_API;
        const batchSize = 40;
        const totalToFetch = 120;
        let allFiction = [];

        const randomOffset = Math.floor(Math.random() * 500);
        const actualStart = startIndex + randomOffset;

        // 2. Add a random common word to the query to shake up the results
        const randomKeywords = ['the', 'life', 'world', 'time', 'man', 'love', 'dark'];
        const randomWord = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];

        for (let i = actualStart; i < actualStart + totalToFetch; i += batchSize) {
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=subject:fiction+${randomWord}&startIndex=${i}&maxResults=${batchSize}&key=${apiKey}`
            );
            
            if (!response.ok) throw new Error('API batch fetch failed');
            const result = await response.json();
            
            if (result.items) {
                allFiction = [...allFiction, ...result.items];
            }
        }

        return allFiction;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
export const fetchByBookAndAuthor = createAsyncThunk(
    'bookdata/fetchByBookAndAuthor',
    async ({ searchTerm, startIndex = 0 }, { rejectWithValue }) => {
        try {
            const apiKey = import.meta.env.VITE_GOOGLE_BOOK_API;

            const cleanTerm = encodeURIComponent(searchTerm.trim());
 
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q="${cleanTerm}"&startIndex=${startIndex}&maxResults=40&key=${apiKey}`
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || 'Search API failed');
            }
            
            const data = await response.json();

            return { 
                items: data.items || [], 
                isNewSearch: startIndex === 0 
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const dataSlice = createSlice({
    name: "bookdata",
    initialState: {
        data: [],
        isError: false,
        isLoading: false,
        errorMessage: ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // --- Handlers for fetchurl (Fiction) ---
            .addCase(fetchurl.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(fetchurl.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                const combined = [...state.data, ...action.payload];
                state.data = Array.from(new Map(combined.map(item => [item.id, item])).values());
            })
            .addCase(fetchurl.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })

            // --- Handlers for fetchByBookAndAuthor (Search) ---
            .addCase(fetchByBookAndAuthor.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(fetchByBookAndAuthor.fulfilled, (state, action) => {
                state.isError = false;
                state.isLoading = false;
                
                const { items, isNewSearch } = action.payload;
                
                if (isNewSearch) {
                    // If it's a fresh search from the search bar, replace the list
                    state.data = items;
                } else {
                    // If it's "Load More" for a search, append the list
                    const combined = [...state.data, ...items];
                    state.data = Array.from(new Map(combined.map(item => [item.id, item])).values());
                }
            })
            .addCase(fetchByBookAndAuthor.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            });
    }
});

export default dataSlice.reducer;