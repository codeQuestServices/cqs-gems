import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Safe haptic feedback triggers with graceful web/unsupported device fallback
 */
export const triggerSelectionHaptic = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.selectionAsync();
  } catch {
    // Graceful fallback if device lacks vibration motor
  }
};

export const triggerLightImpact = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Graceful fallback
  }
};

export const triggerMediumImpact = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Graceful fallback
  }
};

export const triggerSuccessHaptic = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Graceful fallback
  }
};

export const triggerWarningHaptic = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch {
    // Graceful fallback
  }
};
