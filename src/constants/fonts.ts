export const FONTS = {
  thin: "SoDoSans-Thin",
  light: "SoDoSans-Light",
  regular: "SoDoSans-Regular",
  semiBold: "SoDoSans-SemiBold",
  bold: "SoDoSans-Bold",
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const typography = {
  h1: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES["4xl"],
  },
  h2: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES["3xl"],
  },
  h3: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES["2xl"],
  },
  h4: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xl,
  },
  subtitle1: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
  },
  subtitle2: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
  },
  body1: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
  },
  body2: {
    fontFamily: FONTS.light,
    fontSize: FONT_SIZES.sm,
  },
  caption: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
  },
} as const;
