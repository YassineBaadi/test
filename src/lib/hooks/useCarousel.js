import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  nextHighlight,
  setLoading,
  setHighlights,
  goToHighlight,
} from "@/lib/features/carouselSlice";

{
  /* --------------------------------------------------------------------|
    --------------------------- useCarousel ---------------------------|
  */
}
export const useCarousel = () => {
  const carousel = useSelector((state) => state.carousel);
  const dispatch = useDispatch();

  {
    /* --------------------------------------------------------------------|
      --------------------------- Auto-slide effect ---------------------------|
    */
  }
  useEffect(() => {
    if (carousel.loading || carousel.highlights.length === 0) return;

    const interval = setInterval(() => {
      dispatch(nextHighlight());
    }, 5000);

    return () => clearInterval(interval);
  }, [carousel.highlights.length, carousel.loading, dispatch]);

  {
    /* --------------------------------------------------------------------|
      --------------------------- Actions ---------------------------|
    */
  }
  const handleNext = () => {
    if (carousel.loading) return;
    dispatch(nextHighlight());
  };

  const handlePrev = () => {
    if (carousel.loading) return;
    dispatch(prevHighlight());
  };

  const handleGoTo = (index) => {
    dispatch(goToHighlight(index));
  };

  const handleSetHighlights = (highlights) => {
    dispatch(setHighlights(highlights));
  };

  const handleSetLoading = (loading) => {
    dispatch(setLoading(loading));
  };

  {
    /* --------------------------------------------------------------------|
      --------------------------- Computed values ---------------------------|
    */
  }
  const currentGame = carousel.highlights[carousel.currentHighlight];
  const nextGame =
    carousel.highlights[
      (carousel.currentHighlight + 1) % carousel.highlights.length
    ];
  const prevGame =
    carousel.highlights[
      (carousel.currentHighlight - 1 + carousel.highlights.length) %
        carousel.highlights.length
    ];

  return {
    // --------------------------------------------------------------------|
    // --------------------------- State ---------------------------|
    // --------------------------------------------------------------------|
    currentHighlight: carousel.currentHighlight,
    highlights: carousel.highlights,
    loading: carousel.loading,

    // --------------------------------------------------------------------|
    // --------------------------- Computed ---------------------------|
    // --------------------------------------------------------------------|
    currentGame,
    nextGame,
    prevGame,

    // --------------------------------------------------------------------|
    // --------------------------- Actions ---------------------------|
    // --------------------------------------------------------------------|
    handleNext,
    handlePrev,
    handleGoTo,
    handleSetHighlights,
    handleSetLoading,
  };
};
