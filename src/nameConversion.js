export const toCamelCase = (string = "") => {
  return string.includes("_")
    ? string
        .split("_")
        .map((word, index) =>
          index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("")
    : string.replace(/\s+/g, "");
};

export const toSnakeCase = (str = "") => {
  return str.toLowerCase().replace(/ /g, "_");
};

export const toMinusCase = (str = "") => {
  return str.toLowerCase().replace(/ /g, "-");
};

export const toTitleCase = (str = "") => {
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
