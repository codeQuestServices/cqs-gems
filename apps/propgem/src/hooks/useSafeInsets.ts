import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export interface DynamicInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
  tabBarHeight: number;
  tabBarPaddingBottom: number;
  screenBottomPadding: number;
  stickyButtonBottomPadding: number;
  modalFooterPadding: number;
}

/**
 * Hook providing dynamically calculated safe padding for bottom tab bars,
 * sticky footers, and modal actions across Android soft-keys, gesture bars, and iOS Home indicators.
 */
export function useSafeInsets(): DynamicInsets {
  const insets = useSafeAreaInsets();

  // Android 3-button nav has non-zero insets.bottom (typically 24-48px),
  // while gesture navigation has smaller insets (0-16px).
  // iOS Home indicator is typically 34px.
  const hasPhysicalOrVirtualSoftKeys = insets.bottom > 0;

  const tabBarPaddingBottom = Platform.select({
    ios: Math.max(insets.bottom, 16),
    android: hasPhysicalOrVirtualSoftKeys ? insets.bottom + 4 : 10,
    default: 12,
  });

  const tabBarHeight = Platform.select({
    ios: 58 + Math.max(insets.bottom, 16),
    android: 58 + tabBarPaddingBottom,
    default: 64,
  });

  const screenBottomPadding = tabBarHeight + 24;

  const stickyButtonBottomPadding = Math.max(insets.bottom, 16) + 8;

  const modalFooterPadding = Math.max(insets.bottom, 16) + 12;

  return {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
    tabBarHeight,
    tabBarPaddingBottom,
    screenBottomPadding,
    stickyButtonBottomPadding,
    modalFooterPadding,
  };
}
