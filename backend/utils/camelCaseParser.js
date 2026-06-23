function toCamelCase(str) {
  // remove the BOM character \ufeff
  let cleanStr = str.replace(/^\uFEFF/, "");

  /* 
change digits to words - maybe
 
  if (/^\d/.test(cleanStr)) {
    cleanStr = cleanStr
      .replace(/^1st/, "first")
      .replace(/^2nd/, "second")
      .replace(/^3rd/, "third")
      .replace(/^(\d+)/, (match) => `num${match}`);
  }
*/

  return cleanStr
    .replace(/[-_ ]+(.)/g, (match, group1) => group1.toUpperCase())
    .replace(/^./, (match) => match.toLowerCase());
}

module.exports = { toCamelCase };
