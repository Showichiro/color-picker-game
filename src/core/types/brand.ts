declare const brand: unique symbol;

type Brand<T, TBrand> = T & { [brand]: TBrand };

export type RGB = Brand<{ r: number; g: number; b: number }, 'RGB'>;
export type HexColor = Brand<string, 'HexColor'>;