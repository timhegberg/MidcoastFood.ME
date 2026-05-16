// Google Analytics configuration. The tag loads by default; visitors can
// opt out from the privacy policy page, which sets the localStorage key
// below — GoogleAnalytics then skips loading gtag entirely on that browser.

export const GA_MEASUREMENT_ID = "G-6CGDETSY4P";
export const GA_OPTOUT_KEY = "mcf-analytics-optout";
// gtag's own kill switch — setting window[GA_DISABLE_FLAG] = true stops it.
export const GA_DISABLE_FLAG = `ga-disable-${GA_MEASUREMENT_ID}`;
