export interface UserMovies {
    id: string;
    userId: string;
    movieId: string;
    watched: boolean;
    rating: number;
    favorite: boolean;
    watchedDate: string;
    ratingUpdateDate: string;
    saved: boolean;
}
