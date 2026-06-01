declare module "emoji-flags" {
  export interface CountryData {
    code: string;
    emoji: string;
    unicode: string;
    name: string;
  }
  const emojiFlags: {
    countryCode(code: string): CountryData;
    [key: string]: any;
  };
  export default emojiFlags;
}
