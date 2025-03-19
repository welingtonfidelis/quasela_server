const toSnakeCase = (text: string) => {
  const textWithoutSpecialCaracters = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const textSnaked = textWithoutSpecialCaracters
    .replace(/\W+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("-");

  return textSnaked;
};

export { toSnakeCase };
