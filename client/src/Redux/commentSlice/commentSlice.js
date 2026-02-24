import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const baseurl = import.meta.env.VITE_BASE_URL;
/* ========================================
   FETCH COMMENTS (Pagination)
======================================== */
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ reviewId, page = 1 }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${baseurl}/api/comments/${reviewId}?page=${page}&limit=5`
      );

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);

      return { reviewId, comments: data.comments, page };
    } catch (err) {
      return rejectWithValue("Network error");
    }
  }
);

/* ========================================
   ADD COMMENT / REPLY
======================================== */
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ reviewId, userId, text, parentComment }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${baseurl}/api/comments/${reviewId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, text, parentComment }),
        }
      );

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);

      return data.comment;
    } catch (err) {
      return rejectWithValue("Network error");
    }
  }
);

/* ========================================
   FETCH REPLIES
======================================== */
export const fetchReplies = createAsyncThunk(
  "comments/fetchReplies",
  async (commentId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${baseurl}/api/comments/replies/${commentId}`
      );

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);

      return { commentId, replies: data.replies };
    } catch (err) {
      return rejectWithValue("Network error");
    }
  }
);

/* ========================================
   TOGGLE LIKE (FIXED)
======================================== */
export const toggleCommentLike = createAsyncThunk(
  "comments/toggleLike",
  async ({ commentId, userId }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${baseurl}/api/comments/like/${commentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);

      return data;
    } catch (err) {
      return rejectWithValue("Network error");
    }
  }
);

/* ========================================
   SLICE
======================================== */

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    commentsByReview: {},
    repliesByComment: {},
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* FETCH COMMENTS */
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;

        const { reviewId, comments, page } = action.payload;

        if (!state.commentsByReview[reviewId]) {
          state.commentsByReview[reviewId] = {
            comments: [],
            page: 1,
            hasMore: true,
          };
        }

        if (page === 1) {
          state.commentsByReview[reviewId].comments = comments;
        } else {
          state.commentsByReview[reviewId].comments.push(...comments);
        }

        state.commentsByReview[reviewId].page = page;
        state.commentsByReview[reviewId].hasMore = comments.length === 5;
      })

      /* ADD COMMENT */
      .addCase(addComment.fulfilled, (state, action) => {
        const comment = action.payload;

        if (!comment.parentComment) {
          const reviewId = comment.reviewId;

          if (!state.commentsByReview[reviewId]) {
            state.commentsByReview[reviewId] = {
              comments: [],
              page: 1,
              hasMore: true,
            };
          }

          state.commentsByReview[reviewId].comments.unshift(comment);
        } else {
          const parentId = comment.parentComment;

          if (!state.repliesByComment[parentId]) {
            state.repliesByComment[parentId] = [];
          }

          state.repliesByComment[parentId].push(comment);
        }
      })

      /* FETCH REPLIES */
      .addCase(fetchReplies.fulfilled, (state, action) => {
        const { commentId, replies } = action.payload;
        state.repliesByComment[commentId] = replies;
      })

      /* TOGGLE LIKE (FIXED) */
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const updatedComment = action.payload;

        // Update main comments
        for (const reviewId in state.commentsByReview) {
          const comments = state.commentsByReview[reviewId].comments;
          const index = comments.findIndex(
            (c) => c._id === updatedComment._id
          );
          if (index !== -1) {
            comments[index] = updatedComment;
          }
        }

        // Update replies
        for (const parentId in state.repliesByComment) {
          const replies = state.repliesByComment[parentId];
          const index = replies.findIndex(
            (r) => r._id === updatedComment._id
          );
          if (index !== -1) {
            replies[index] = updatedComment;
          }
        }
      });
  },
});

export default commentSlice.reducer;
