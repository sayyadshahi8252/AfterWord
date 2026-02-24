import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const baseurl = import.meta.env.VITE_BASE_URL;

// Async thunk to send book data to the backend
export const addToWatchlist = createAsyncThunk(
    "books/watchlist",
    async (data, { rejectWithValue }) => {
        try {
            console.log("Sending request...");
            const response = await fetch(`${baseurl}/api/book/watchlist`, {
                method: "POST", // Fixed typo: 'mathod' -> 'method'
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                return rejectWithValue(result.message || "Failed to add to watchlist");
            }

            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const currentlyreading = createAsyncThunk(
    "books/currentlyreading",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${baseurl}/api/book/currentlyreading/${id}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const readingcurrently = createAsyncThunk(
    "books/readingcurrently",
    async (bookid, { rejectWithValue }) => {
        console.log(bookid)
        try {
            const response = await fetch(`${baseurl}/api/book/reading`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookid })
            });

            const result = await response.json();

            if (!response.ok) throw new Error("Failed to update book");

            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const currentlyReadingBook = createAsyncThunk(
    "books/currentlyReadingBook",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${baseurl}/api/book/currently-reading/${id}`);

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || "Failed to fetch");
            }

            const result = await response.json();
            return result; // This becomes the 'action.payload'
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const updateBookProgress = createAsyncThunk(
    "books/updateBookProgress",
    async ({ bookId, currentPage, pageCount }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${baseurl}/api/book/updatebookprogress`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                // Pass the variables into the body
                body: JSON.stringify({ bookId, currentPage, pageCount })
            });

            const result = await response.json();

            if (!response.ok) {
                return rejectWithValue(result.message || "Failed to update progress");
            }

            return result; // This is the updated book object
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const movingtocompleted = createAsyncThunk(
    "books/movingtocompleted",
    async ({ bookId, userId }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${baseurl}/api/book/movingtocompleted`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId, userId })
            });
            const data = await response.json();

            if (!response.ok) return rejectWithValue(data.message);

            // Return the updated book that was moved
            return data.updatedBook;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const completedbook = createAsyncThunk(
    "books/completedbook",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${baseurl}/api/book/completedbook/${id}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch completed books");
            }

            const result = await response.json();
            return result;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const setbookgoal = createAsyncThunk("books/setbookgoal", async ({ userid, goalText }, { rejectWithValue }) => {
    try {
        const response = await fetch(`${baseurl}/api/book/setbookgoal`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userid, goalText })
        })
        const result = await response.json()
        if (!response.ok) {
            return rejectWithValue(result.message || "Failed to moved to completed ");
        }

        return result;
    } catch (error) {
        return rejectWithValue(error.message);
    }
})
export const fetchUserStats = createAsyncThunk(
    "user/fetchStats",
    async (userId, { rejectWithValue }) => {

        try {
            const response = await fetch(
                `${baseurl}/api/book/getUserStats/${userId}`
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message);
            }

            return data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const deletbook = createAsyncThunk(
  "books/deletbook",
  async ({ userId, bookid }, { rejectWithValue }) => {
    try {
      // Get tokens from localStorage
      let accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      // Function to make DELETE request
      const makeDeleteRequest = async (token) => {
        const res = await fetch(
          `${baseurl}/api/book/deletebookById/${userId}/${bookid}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        return { res, data };
      };

      // First attempt with current access token
      let { res, data } = await makeDeleteRequest(accessToken);

      // If 401, try to refresh token
      if (res.status === 401 && refreshToken) {
        const refreshRes = await fetch(`${baseurl}/api/book/refresh-token`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${refreshToken}` },
        });
        const refreshData = await refreshRes.json();

        if (!refreshRes.ok) {
          return rejectWithValue(refreshData.message || "Session expired");
        }

        // Save new access token
        accessToken = refreshData.accessToken;
        localStorage.setItem("accessToken", accessToken);

        // Retry original request with new access token
        ({ res, data } = await makeDeleteRequest(accessToken));
      }

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to delete book");
      }

      return data; // Success response

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const bookSlice = createSlice({
    name: "books",
    initialState: {
        watchlist: [], // Storing the list of books
        activeBooks: [],
        completedbook: [],
        booksthatiscompleted: [],
        isError: false,
        isLoading: false,
        message: "",
        goal: 0,
        goalbook: 0,
        totalbookread: 0,
        genres: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle Pending State
            .addCase(addToWatchlist.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            // Handle Success State
            .addCase(addToWatchlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;

                // Assuming backend returns the updated watchlist
                state.watchlist = action.payload;

                // Optional: If backend returns only the added book
                // state.watchlist.push(action.payload);
            })

            // Handle Error State
            .addCase(addToWatchlist.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(currentlyreading.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(currentlyreading.fulfilled, (state, action) => {
                state.isLoading = false;
                state.watchlist = action.payload.watchlist; // if backend sends object
            })

            .addCase(currentlyreading.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(readingcurrently.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(readingcurrently.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                const updatedBook = action.payload;
                const index = state.watchlist.findIndex(b => b._id === updatedBook._id);
                if (index !== -1) state.watchlist[ index ] = updatedBook;
            })
            .addCase(readingcurrently.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(currentlyReadingBook.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(currentlyReadingBook.fulfilled, (state, action) => {
                state.isLoading = false;
                // Store the filtered books from the backend params search
                state.activeBooks = action.payload;
                state.isError = false;
            })
            .addCase(currentlyReadingBook.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateBookProgress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateBookProgress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                const index = state.activeBooks.findIndex(
                    (book) => book._id === action.payload._id
                );

                if (index !== -1) {
                    state.activeBooks[ index ] = action.payload;
                }
            })
            .addCase(updateBookProgress.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(movingtocompleted.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(movingtocompleted.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;

                const updatedBook = action.payload;

                // Remove from activeBooks (currently reading)
                state.activeBooks = state.activeBooks.filter(
                    (book) => book._id !== updatedBook._id
                );

                // Optionally, add to completed books list
                state.completedbook.push(updatedBook);
            })

            .addCase(movingtocompleted.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(completedbook.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            // Fulfilled
            .addCase(completedbook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.booksthatiscompleted = action.payload;
            })

            // Rejected
            .addCase(completedbook.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(setbookgoal.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = "";
            })

            .addCase(setbookgoal.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.goal = action.payload.goal;

                state.message = "Reading goal updated successfully";
            })

            .addCase(setbookgoal.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || "Failed to update goal";
            })
            .addCase(fetchUserStats.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = "";
            })

            .addCase(fetchUserStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;

                state.totalbookread = action.payload.totalbookread;
                state.goalbook = action.payload.goal;
                state.genres = action.payload.genres || [];
            })


            .addCase(fetchUserStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || "Failed to fetch user stats";
            })
            .addCase(deletbook.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = "";
            })
            .addCase(deletbook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;

                // Remove the deleted book from the watchlist in Redux state
                const deletedBookId = action.payload.bookId; // make sure backend returns { bookId }
                state.watchlist = state.watchlist.filter(book => book._id !== deletedBookId);

                state.message = "Book removed from watchlist successfully";
            })
            .addCase(deletbook.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || "Failed to remove book from watchlist";
            })


    }
});

export default bookSlice.reducer;