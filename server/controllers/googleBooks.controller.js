import axios from "axios";

export const getFictionBooks = async (req, res) => {
  try {
    const { startIndex = 0 } = req.query;

    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: {
          q: "fiction",
          startIndex: Number(startIndex),
          maxResults: 20,
          key: process.env.GOOGLE_BOOK_API
        }
      }
    );

    console.log("Total Items:", response.data.totalItems);

    res.json(response.data.items ?? []);

  } catch (error) {
    console.error("GOOGLE ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { searchTerm, startIndex = 0 } = req.query;

    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: {
          q: `"${searchTerm}"`,
          startIndex,
          maxResults: 40,
          key: process.env.GOOGLE_BOOK_API
        }
      }
    );

    res.json(response.data.items || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};