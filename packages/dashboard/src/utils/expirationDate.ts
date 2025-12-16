const dateFormat = new Intl.DateTimeFormat('en', {});

export const formatExpirationDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError('Invalid date format');
  }

  const formattedDate = dateFormat.format(date);

  return formattedDate;
};
