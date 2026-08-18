import React from 'react';
import Svg, { Path, Line, Circle, Rect, Polyline } from 'react-native-svg';

export interface PropGemIconProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

/**
 * PropGem Emblem: Roof gable + Diamond Gemstone + Shield vector emblem
 */
export const PropGemEmblem: React.FC<PropGemIconProps> = ({
  size = 32,
  color = '#FAFAFA',
  accentColor = '#38BDF8',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Roof Gable */}
      <Path
        d="M5 14L16 4L27 14"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Shield Silhouette */}
      <Path
        d="M8 15V20C8 25 16 28 16 28C16 28 24 25 24 20V15"
        stroke="#52525B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gemstone Table & Facets */}
      <Path
        d="M16 10L21 14L16 22L11 14L16 10Z"
        fill="#22C55E"
        fillOpacity={0.25}
        stroke="#22C55E"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <Line x1="11" y1="14" x2="21" y2="14" stroke="#22C55E" strokeWidth="1.5" />
      <Line x1="16" y1="10" x2="16" y2="22" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
};

/**
 * Mortgage P&I Icon: House outline with precision P&I division / calculation nodes
 */
export const MortgagePIIcon: React.FC<PropGemIconProps> = ({
  size = 24,
  color = '#A1A1AA',
  accentColor = '#38BDF8',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5L12 3L21 10.5"
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 9.5V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V9.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <Line x1="9" y1="13" x2="15" y2="13" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="9" cy="17" r="1.2" fill={accentColor} />
      <Circle cx="15" cy="17" r="1.2" fill={accentColor} />
      <Circle cx="12" cy="9.5" r="1" fill="#FAFAFA" />
    </Svg>
  );
};

/**
 * LTV Shield Icon: Protective structure with gemstone equity core
 */
export const LtvShieldIcon: React.FC<PropGemIconProps> = ({
  size = 24,
  color = '#38BDF8',
  accentColor = '#22C55E',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 7L16 10L12 15L8 10L12 7Z"
        fill={accentColor}
        fillOpacity={0.2}
        stroke={accentColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Line x1="8" y1="10" x2="16" y2="10" stroke={accentColor} strokeWidth="1.2" />
      <Line x1="12" y1="7" x2="12" y2="15" stroke="#FAFAFA" strokeWidth="1.2" />
    </Svg>
  );
};

/**
 * PMI Drop-off Indicator: Barrier threshold line with downward clearance vector
 */
export const PmiDropOffIcon: React.FC<PropGemIconProps> = ({
  size = 24,
  color = '#A1A1AA',
  accentColor = '#22C55E',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line
        x1="3"
        y1="9"
        x2="21"
        y2="9"
        stroke="#71717A"
        strokeDasharray="2 2"
        strokeWidth="1.5"
      />
      <Path
        d="M4 4H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V4Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <Line x1="12" y1="7" x2="12" y2="17" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
      <Path
        d="M8.5 13.5L12 17L15.5 13.5"
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="18" cy="17" r="1.8" fill={accentColor} />
    </Svg>
  );
};

/**
 * Cash Flow Chart Icon: Dynamic waterfall / rising cash flow bars with net trajectory
 */
export const CashFlowChartIcon: React.FC<PropGemIconProps> = ({
  size = 24,
  color = '#71717A',
  accentColor = '#22C55E',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="14" width="3.5" height="7" rx="1" fill={color} />
      <Rect x="8.5" y="10" width="3.5" height="11" rx="1" fill="#38BDF8" />
      <Rect x="14" y="6" width="3.5" height="15" rx="1" fill={accentColor} />
      <Path
        d="M4 11L10 7L14 9L20 4"
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline
        points="16,4 20,4 20,8"
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

/**
 * Cap Rate Up Icon: Yield return growth vector with diamond percentage nodes
 */
export const CapRateUpIcon: React.FC<PropGemIconProps> = ({
  size = 24,
  color = '#52525B',
  accentColor = '#38BDF8',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line
        x1="6"
        y1="18"
        x2="18"
        y2="6"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Polyline
        points="10,6 18,6 18,14"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="8" cy="10" r="1.5" fill="#FAFAFA" />
      <Circle cx="16" cy="18" r="1.5" fill="#FAFAFA" />
      <Path d="M4 20H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
};

/**
 * Portfolio Folder Icon: Multi-asset repository folder with diamond watermark
 */
export const PortfolioFolderIcon: React.FC<PropGemIconProps> = ({
  size = 24,
  color = '#A1A1AA',
  accentColor = '#38BDF8',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V5C2 3.89543 2.89543 3 4 3H9L11 6H20C21.1046 6 22 6.89543 22 8V19Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 11L15 13.5L12 17L9 13.5L12 11Z"
        fill={accentColor}
        fillOpacity={0.25}
        stroke={accentColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Line x1="9" y1="13.5" x2="15" y2="13.5" stroke={accentColor} strokeWidth="1" />
    </Svg>
  );
};
