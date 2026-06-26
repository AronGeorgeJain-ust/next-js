export const today = () =>
  new Date().toLocaleDateString("en-GB").replaceAll("/", "-");
