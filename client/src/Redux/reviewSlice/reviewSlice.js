import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const baseurl = import.meta.env.VITE_BASE_URL;
// Async thunk to post a review
export const reviewpost = createAsyncThunk(
    "reviews/reviewpost",
    async (reviewData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${baseurl}/api/post/reviewpost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewData),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || "Failed to post review");
            }

            return data; // Return the saved review
        } catch (error) {
            return rejectWithValue(error.message || "Network Error");
        }
    }
);

// Async thunk to make a review public
export const postprivate = createAsyncThunk(
    "reviews/postprivate",
    async ({ userId, bookid }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${baseurl}/api/post/postprivate`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, bookid }),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || "Failed to make review public");
            }

            return data; // return updated review
        } catch (error) {
            return rejectWithValue(error.message || "Network Error");
        }
    }
);

// Async thunk to fetch all public posts
export const fetchAllPost = createAsyncThunk(
    "reviews/fetchAllPost",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${baseurl}/api/post/fetchpost`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || "Failed to fetch public posts");
            }

            return data.reviews; // return array of public reviews
        } catch (error) {
            return rejectWithValue(error.message || "Network Error");
        }
    }
);
export const toggleLike = createAsyncThunk(
    "reviews/toggleLike",
    async ({ reviewId, userId }, { rejectWithValue }) => {
        try {

            console.log("Sending Like:", reviewId, userId);

            const response = await fetch(
                `${baseurl}/api/post/togglelike/${reviewId}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message);
            }

            return data.review;

        } catch (error) {
            console.error("LIKE ERROR:", error);
            return rejectWithValue("Network error");
        }
    }
);
/* ========================================
   TOGGLE SAVE POST (PATCH)
======================================== */
export const toggleSavePost = createAsyncThunk(
    "reviews/toggleSavePost",
    async ({ reviewId, userId }, { rejectWithValue }) => {

        try {
            const response = await fetch(`${baseurl}/api/post/save-post`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId, userId }),
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message);

            // Return data.saved because that's what your backend sends
            return data.saved;
        } catch (error) {
            return rejectWithValue("Network Error");
        }
    }
);

export const fetchbookmarkpost = createAsyncThunk("reviews/fetchbookmarkpost", async (userId, { rejectWithValue }) => {
    try {
        const response = await fetch(`${baseurl}/api/post/bookmark/${userId}`)
        const data = await response.json();
        if (!response.ok) return rejectWithValue(data.message);
        return data
    } catch (error) {
        return rejectWithValue("Network Error");
    }
})

export const deletebookmark=createAsyncThunk("reviews/deletebookmark",async({userId,bookId},{rejectWithValue})=>{
        try {
        const response = await fetch(`${baseurl}/api/post/removeparticularbookmark/${userId}/${bookId}`,{
            method:"DELETE"
        })
        const data = await response.json();
        if (!response.ok) return rejectWithValue(data.message);
        return data
    } catch (error) {
        return rejectWithValue("Network Error");
    }
})
const reviewSlice = createSlice({
    name: "reviews",
    initialState: {
        userReviews: [], // stores all user reviews
        publicReviews: [], // stores all public reviews
        isLoading: false,
        isError: false,
        errorMessage: null,
        userSavedPosts: [],
        bookmark: []
    },
    reducers: {
        setUserReviews: (state, action) => {
            state.userReviews = action.payload; // set all reviews for user
        },
    },
    extraReducers: (builder) => {
        builder
            // reviewpost
            .addCase(reviewpost.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = null;
            })
            .addCase(reviewpost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.userReviews.push(action.payload.review);
            })
            .addCase(reviewpost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            // postprivate
            .addCase(postprivate.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = null;
            })
            .addCase(postprivate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                const index = state.userReviews.findIndex(
                    (r) => r._id === action.payload.review._id
                );
                if (index !== -1) {
                    state.userReviews[ index ] = action.payload.review;
                }
            })
            .addCase(postprivate.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            // fetchAllPost
            .addCase(fetchAllPost.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = null;
            })
            .addCase(fetchAllPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.publicReviews = action.payload;
            })
            .addCase(fetchAllPost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                const index = state.publicReviews.findIndex(
                    (r) => r._id === action.payload._id
                );

                if (index !== -1) {
                    state.publicReviews[ index ] = action.payload;
                }
            })
            .addCase(toggleSavePost.fulfilled, (state, action) => {
                // action.payload is now the 'saved' array from your backend
                state.userSavedPosts = action.payload;
            })
            // Inside extraReducers (builder) => { ... }

            /* ========================================
               FETCH BOOKMARKED POSTS (POPULATED)
            ======================================== */
            .addCase(fetchbookmarkpost.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(fetchbookmarkpost.fulfilled, (state, action) => {
                state.isLoading = false;
                // Assuming your backend returns { reviews: [...] }
                // If it returns the array directly, just use action.payload
                state.bookmark = action.payload.reviews || action.payload;
            })
            .addCase(fetchbookmarkpost.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload;
            })
            /* ========================================
   DELETE PARTICULAR BOOKMARK
======================================== */
.addCase(deletebookmark.pending, (state) => {
    state.isLoading = true;
    state.errorMessage = null;
})
.addCase(deletebookmark.fulfilled, (state, action) => {
    state.isLoading = false;

    // Backend returns updated saved array
    const updatedSavedIds = action.payload.saved;

    // Keep only posts that still exist in saved
    state.bookmark = state.bookmark.filter(
        (post) => updatedSavedIds.includes(post._id)
    );
})

.addCase(deletebookmark.rejected, (state, action) => {
    state.isLoading = false;
    state.errorMessage = action.payload;
});

    },
});

export const { setUserReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
