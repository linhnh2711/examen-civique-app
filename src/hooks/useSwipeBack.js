import { useEffect, useRef } from 'react';

/**
 * Custom hook for swipe-back gesture (swipe from left edge to go back)
 * Similar to iOS/Android native back gesture
 */
export const useSwipeBack = (onBack, enabled = true) => {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchEndX = useRef(null);
  const touchEndY = useRef(null);

  useEffect(() => {
    if (!enabled || !onBack) return;

    const minSwipeDistance = 80; // Minimum distance for a valid swipe
    const edgeThreshold = 30; // Distance from left edge to start gesture
    const maxVerticalMovement = 50; // Max vertical movement to still count as horizontal swipe

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      touchEndX.current = null;
      touchEndY.current = null;
    };

    const handleTouchMove = (e) => {
      if (touchStartX.current === null) return;

      const touch = e.touches[0];
      touchEndX.current = touch.clientX;
      touchEndY.current = touch.clientY;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current === null || touchEndX.current === null) {
        // Reset
        touchStartX.current = null;
        touchStartY.current = null;
        touchEndX.current = null;
        touchEndY.current = null;
        return;
      }

      // Check if swipe started from left edge
      if (touchStartX.current > edgeThreshold) {
        touchStartX.current = null;
        touchStartY.current = null;
        touchEndX.current = null;
        touchEndY.current = null;
        return;
      }

      const horizontalDistance = touchEndX.current - touchStartX.current;
      const verticalDistance = Math.abs(touchEndY.current - touchStartY.current);

      // Check if it's a valid right swipe (left to right)
      const isRightSwipe = horizontalDistance > minSwipeDistance;
      const isMostlyHorizontal = verticalDistance < maxVerticalMovement;

      if (isRightSwipe && isMostlyHorizontal) {
        onBack();
      }

      // Reset
      touchStartX.current = null;
      touchStartY.current = null;
      touchEndX.current = null;
      touchEndY.current = null;
    };

    // Add listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onBack, enabled]);
};
