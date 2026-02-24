import React, { useEffect, useState } from 'react';
import styles from './Explorecenter.module.css';
import bookPlaceholder from '../../assets/images/book1.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchurl, fetchByBookAndAuthor } from '../../Redux/dataSlice/dataSlice';
import { addToWatchlist } from '../../Redux/bookSlice/bookSlice';

const Explorecenter = () => {
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ selectedBook, setSelectedBook ] = useState(null);

    const { data, isLoading, isError } = useSelector((state) => state.bookdata);
    const dispatch = useDispatch();

    const {book}=useSelector((state)=>state.books)
    
    const {user}=useSelector((state)=>state.users)
 
    // 1. Initial Load: Get fiction books
    useEffect(() => {
        dispatch(fetchurl(0));
    }, [ dispatch ]);

    // 2. Search Logic: Trigger fetchByBookAndAuthor when user types
    useEffect(() => {
        // Only search if there are at least 3 characters
        if (searchQuery.trim().length > 2) {
            const delayDebounce = setTimeout(() => {
                dispatch(fetchByBookAndAuthor({ searchTerm: searchQuery, startIndex: 0 }));
            }, 600); // Wait 600ms after typing stops

            return () => clearTimeout(delayDebounce);
        } else if (searchQuery.length === 0) {
            // Revert back to the main fiction feed if search is cleared
            dispatch(fetchurl(0));
        }
    }, [ searchQuery, dispatch ]);
    const handleLoadMore = () => {
        if (searchQuery.trim().length > 2) {
            dispatch(fetchByBookAndAuthor({ searchTerm: searchQuery, startIndex: data.length }));
        } else {
            dispatch(fetchurl(data.length));
        }
    };

    const handleWatchlist = (book) => {
        const bookData = {
            googleId: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors,
            description: book.volumeInfo.description || book.searchInfo?.textSnippet,
            image: book.volumeInfo.imageLinks?.thumbnail,
            category: book.volumeInfo.categories?.[ 0 ],
            pageCount: book.volumeInfo.pageCount,
            rating: book.volumeInfo.averageRating
        };
          const userdata = JSON.parse(localStorage.getItem("user"));
         const userId = userdata?.id;
        dispatch(addToWatchlist({...bookData,userId}))
    };

    return (
        <div className={`${styles.exploreWrapper} ${selectedBook ? styles.noScroll : ''}`}>
            <header className={styles.exploreHeader}>
                <h1 className={styles.title}>Explore Afterword</h1>
                <p className={styles.subtitle}>Curated for the serious reader.</p>
                <div className={styles.searchBar}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            {isLoading && data.length === 0 && <div className={styles.loading}>Loading library...</div>}
            {isError && <div className={styles.error}>Unable to fetch books. Check your API key.</div>}

            <div className={styles.bookGrid}>
                {/* We map directly from 'data' now because the API handles the filtering */}
                {data?.map((book) => {
                    const info = book.volumeInfo;
                    return (
                        <div key={book.id} className={styles.bookCard}>
                            <div className={styles.coverContainer}>
                                <img
                                    src={info.imageLinks?.thumbnail?.replace('http:', 'https:') || bookPlaceholder}
                                    alt={info.title}
                                    className={styles.coverImg}
                                />
                                <div className={styles.genreBadge}>
                                    {info.categories ? info.categories[ 0 ] : 'General'}
                                </div>
                            </div>

                            <div className={styles.info}>
                                <h3 className={styles.bookTitle}>{info.title}</h3>
                                <p className={styles.author}>
                                    {info.authors ? info.authors.join(', ') : 'Unknown Author'}
                                </p>

                                <div className={styles.actionGroup}>
                                    <button className={styles.readMoreBtn} onClick={() => setSelectedBook(book)}>
                                        Read More
                                    </button>
                                    <button
                                        className={styles.addBtnSmall}
                                        onClick={() => handleWatchlist(book)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedBook && (
                <div className={styles.modalOverlay} onClick={() => setSelectedBook(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setSelectedBook(null)}>×</button>

                        <div className={styles.modalBody}>
                            <img
                                src={selectedBook.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || bookPlaceholder}
                                alt={selectedBook.volumeInfo.title}
                                className={styles.modalCover}
                            />
                            <div className={styles.modalInfo}>
                                <span className={styles.modalGenre}>
                                    {selectedBook.volumeInfo.categories?.join(' / ') || 'General'}
                                </span>
                                <h2 className={styles.modalTitle}>{selectedBook.volumeInfo.title}</h2>
                                <p className={styles.modalAuthor}>
                                    By {selectedBook.volumeInfo.authors?.join(', ') || 'Unknown'}
                                </p>

                                <div className={styles.modalStats}>
                                    <span>📖 {selectedBook.volumeInfo.pageCount || 'N/A'} pages</span>
                                    <span>⭐ {selectedBook.volumeInfo.averageRating || 'No'} Rating</span>
                                    <span>🌐 {selectedBook.volumeInfo.language?.toUpperCase()}</span>
                                </div>

                                <p className={styles.modalDesc}>
                                    {selectedBook.volumeInfo.description ||
                                        selectedBook.searchInfo?.textSnippet?.replace(/<\/?[^>]+(>|$)/g, "") ||
                                        "No description available for this volume."}
                                </p>

                                <button
                                    className={styles.modalAddBtn}
                                    onClick={() => {
                                        handleWatchlist(selectedBook); 
                                        setSelectedBook(null);
                                    }}
                                >
                                    Add to Watchlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.footer}>
                {data.length > 0 && (
                    <button
                        className={styles.loadMoreBtn}
                        disabled={isLoading}
                        onClick={handleLoadMore}
                    >
                        {isLoading ? "Curating more..." : "Discover More Books"}
                    </button>
                )}
            </div>
            <div className={styles.footerNote}>End of catalog.</div>
        </div>
    );
};

export default Explorecenter;