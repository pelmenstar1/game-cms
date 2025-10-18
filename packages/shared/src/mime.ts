type MimeTypeMap = {
  text: ['css', 'javascript'];
};

export type MimeType = {
  [K in keyof MimeTypeMap]: `${K}/${MimeTypeMap[K][number]}`;
}[keyof MimeTypeMap];
