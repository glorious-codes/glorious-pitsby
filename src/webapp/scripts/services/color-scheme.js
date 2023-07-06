import { STORED_COLOR_SCHEME_KEY } from '@scripts/constants/storage';

export const storeColorScheme = scheme => localStorage.setItem(STORED_COLOR_SCHEME_KEY, scheme);

export const getStoredColorScheme = () => localStorage.getItem(STORED_COLOR_SCHEME_KEY);
