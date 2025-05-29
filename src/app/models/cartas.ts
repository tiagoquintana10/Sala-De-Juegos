export interface Cartas {
  code: string;
  image: string;
  images: CardImage;
  value: string;
  suit: string;

}
export interface CardImage {
  svg: string;
  png: string;
}