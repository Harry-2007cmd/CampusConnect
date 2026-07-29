// Shared design tokens — docs/DESIGN.md (D-014). Do not hardcode colors/spacing/radii in screens.
// Ported verbatim from the mobile build so the website doesn't visually fork from the app.

export const colors = {
  primary: "#FF7A59",
  primaryPressed: "#E85F3D",
  secondary: "#3D8BFF",
  success: "#4CAF7D",
  warning: "#F2A93B",
  error: "#E85D5D",
  textPrimary: "#2B2420",
  textSecondary: "#8A7F76",
  background: "#FFF8F3",
  surface: "#FFFFFF",
  border: "#EDE2D9",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  button: 999,
  card: 16,
  input: 12,
  avatar: 999,
};

export const typography = {
  caption: 12,
  bodySmall: 14,
  body: 16,
  subheading: 20,
  title: 24,
  weight: {
    regular: "400",
    semibold: "600",
    bold: "700",
  },
  // Nested mirror of the flat keys above — carpool components read typography.size.*.
  size: {
    caption: 12,
    bodySmall: 14,
    body: 16,
    subheading: 20,
    title: 24,
  },
};
