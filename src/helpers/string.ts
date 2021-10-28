export const generateFileName = (name: string, suffix: string) =>
  `${name.slice(0, name.lastIndexOf("."))}${suffix}`;
