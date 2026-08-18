import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { triggerLightImpact, triggerSelectionHaptic } from '../utils/haptics';

export interface SliderInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  helperText?: string;
  accentColor?: string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  helperText,
  accentColor = '#38BDF8',
}) => {
  const handleTextChange = (text: string) => {
    // Remove non-digits and non-decimal characters
    const cleaned = text.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    if (!isNaN(num)) {
      onChange(Math.min(max, Math.max(min, num)));
    } else if (cleaned === '') {
      onChange(min);
    }
  };

  const handleStepChange = (delta: number) => {
    triggerLightImpact();
    const nextVal = Math.min(max, Math.max(min, Math.round((value + delta) * 100) / 100));
    onChange(nextVal);
  };

  const handleSliderValueChange = (val: number) => {
    triggerSelectionHaptic();
    onChange(val);
  };

  const formattedDisplay = value.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputContainer}>
          {prefix ? <Text style={styles.affix}>{prefix}</Text> : null}
          <TextInput
            style={styles.textInput}
            value={formattedDisplay}
            onChangeText={handleTextChange}
            keyboardType="decimal-pad"
            placeholderTextColor="#71717A"
            selectTextOnFocus
          />
          {suffix ? <Text style={styles.affix}>{suffix}</Text> : null}
        </View>
      </View>

      <View style={styles.sliderRow}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => handleStepChange(-step)}
          activeOpacity={0.7}
        >
          <Ionicons name="remove" size={16} color="#A1A1AA" />
        </TouchableOpacity>

        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.slider}
            minimumValue={min}
            maximumValue={max}
            step={step}
            value={value}
            onValueChange={handleSliderValueChange}
            minimumTrackTintColor={accentColor}
            maximumTrackTintColor="#27272A"
            thumbTintColor={accentColor}
          />
        </View>

        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => handleStepChange(step)}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={16} color="#A1A1AA" />
        </TouchableOpacity>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.boundText}>
          {prefix}{min.toLocaleString()}{suffix}
        </Text>
        {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
        <Text style={styles.boundText}>
          {prefix}{max.toLocaleString()}{suffix}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18181B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#09090B',
    borderWidth: 1,
    borderColor: '#3F3F46',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 110,
    justifyContent: 'flex-end',
  },
  affix: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    color: '#FAFAFA',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
    padding: 0,
    marginLeft: 2,
    minWidth: 50,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  sliderWrapper: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  slider: {
    width: '100%',
    height: 44,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  boundText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '500',
  },
  helperText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '500',
  },
});

