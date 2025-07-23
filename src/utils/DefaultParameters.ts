export const DefaultParameters = {
  x: {
    init: (peak: any) => peak.x,
    min: (peak: any, peakShape: any) => peak.x - peakShape.fwhm * 2,
    max: (peak: any, peakShape: any) => peak.x + peakShape.fwhm * 2,
    gradientDifference: (peak: any, peakShape: any) => peakShape.fwhm * 2e-3,
  },
  y: {
    init: (peak: any) => peak.y,
    min: () => 0,
    max: () => 1.5,
    gradientDifference: () => 1e-3,
  },
  fwhm: {
    init: (peak: any, peakShape: any) => peakShape.fwhm,
    min: (peak: any, peakShape: any) => peakShape.fwhm * 0.25,
    max: (peak: any, peakShape: any) => peakShape.fwhm * 4,
    gradientDifference: (peak: any, peakShape: any) => peakShape.fwhm * 2e-3,
  },
  mu: {
    init: (peak: any, peakShape: any) => peakShape.mu,
    min: () => 0,
    max: () => 1,
    gradientDifference: () => 0.01,
  },
};
