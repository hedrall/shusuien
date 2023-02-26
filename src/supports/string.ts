export const ひらがなtoカタカナ = (hiragana: string): string => {
  return hiragana.replace(/[\u3041-\u3096]/g, match => {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
};
