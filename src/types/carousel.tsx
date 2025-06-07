import { ReactNode } from 'react';

type CarouselItem = {
  mainMedia: string; // URL de la imagen o video principal
  content?: ReactNode; // Contenido TSX opcional que acompaña al media principal
};

export type HeaderCarouselData = CarouselItem[]; // Definición del tipo HeaderCarouselData como un array de CarouselItem