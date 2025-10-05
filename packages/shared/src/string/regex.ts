export const urlRegex =
  /^https?:\/\/(?:[a-z\d]+(?::[a-z\d]+)?@)?(?:[a-z\d.-]{1,253})(?::\d{1,5})?(?:\/[a-z\d\-./_]*)?(?:\?[a-z\d.-_=]+)?(?:#[a-z\d.-_]*)?$/i;

// Local part (before @)
// - A-Z ignoring the case
// - 0-9
// - !#$%&'*+-/=?^_`{|}~
// - . provided that it does not appear consecutively
// - max length: 64
// Domain part (after @)
// - A-Z ignoring the case
// - 0-9
// - - (hyphen)
export const emailRegex =
  /^(?:[a-z\d!#$%&'*+\-/=?^_`{|}~]|(\.(?!\.))){1,64}@[a-z\d][a-z\d.-]+[a-z\d]$/i;
