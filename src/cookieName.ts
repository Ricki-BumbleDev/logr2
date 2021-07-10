const characterOptions = [
  ['S', 's', '5', '$'],
  ['E', 'e', '3', '€'],
  ['S', 's', '5', '$'],
  ['S', 's', '5', '$'],
  ['I', 'i', '1', '!'],
  ['O', 'o', '0'],
  ['N', 'n']
];

const cookieNameRegEx = /^[Ss5\$][Ee3€][Ss5\$][Ss5\$][Ii1!][Oo0][Nn]$/;

const getRandomElement = (elements: any[]) => elements[Math.floor(Math.random() * elements.length)];

export const getCookieName = () => characterOptions.map(getRandomElement).join('');

export const getSessionId = (cookies: Record<string, string>) =>
  Object.entries(cookies).find(([key]) => cookieNameRegEx.test(key))?.[1];
