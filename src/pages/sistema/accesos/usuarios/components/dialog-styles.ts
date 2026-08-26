export const spotlightPrimaryActionSx = {
  minWidth: 190,
  borderRadius: 1.75,
  px: 2.75,
  py: 1.15,
  fontWeight: 700,
  boxShadow: "0 14px 28px rgba(25, 118, 210, 0.28)",
};

export const spotlightDialogPaperSx = {
  width: { xs: "calc(100vw - 32px)", md: "calc(100vw - 48px)" },
  maxWidth: "none",
  height: { xs: "calc(100vh - 88px)", md: "calc(100vh - 112px)" },
  maxHeight: "none",
  mt: { xs: "72px", md: "88px" },
  mb: { xs: 2, md: 3 },
  mx: { xs: 2, md: 3 },
  display: "flex",
  flexDirection: "column",
};

export const spotlightDialogContentSx = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

export const spotlightDialogGridSx = {
  display: "grid",
  gap: 2.5,
  pt: 0.5,
};

export const spotlightDialogFullHeightGridSx = {
  ...spotlightDialogGridSx,
  height: "100%",
};

export const spotlightErrorBannerSx = {
  px: 2,
  py: 1.5,
  borderRadius: 1.5,
  border: "1px solid",
  borderColor: "error.light",
  backgroundColor:
    "color-mix(in srgb, var(--mui-palette-error-main, #d32f2f) 10%, var(--mui-palette-background-paper, #fff))",
};

export const spotlightSectionFieldsSx = {
  display: "grid",
  gap: 2,
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
};

export function createSpotlightSectionSx(accentVar: string, accentPercent: number) {
  return {
    display: "grid",
    gap: 2,
    p: { xs: 2, md: 2.5 },
    borderRadius: 1.5,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor:
      "color-mix(in srgb, var(--mui-palette-background-paper, #fff) 94%, transparent)",
    background: `linear-gradient(
      180deg,
      color-mix(in srgb, var(--mui-palette-background-paper, #fff) 96%, ${accentVar} ${accentPercent}%) 0%,
      color-mix(in srgb, var(--mui-palette-background-paper, #fff) 91%, transparent) 100%
    )`,
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
  };
}