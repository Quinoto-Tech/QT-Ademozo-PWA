export interface RestaurantImage {
  name: string;
  url: string;
}

export interface Restaurant {
  name: string;
  slug: string;
  tenant: string;
  images: RestaurantImage[];
}

export const restaurants: Restaurant[] = [
  {
    name: "El Cardenal",
    slug: "el-cardenal",
    tenant: "",
    images: [
      { name: "el-cardenal-0", url: "images/el-cardenal-0.jpg" },
      { name: "el-cardenal-1", url: "images/el-cardenal-1.jpg" },
      { name: "el-cardenal-2", url: "images/el-cardenal-2.webp" },
    ],
  },
  {
    name: "Corazón de Maguey",
    slug: "corazon-de-maguey",
    tenant: "",
    images: [
      { name: "corazon-de-maguey-0", url: "images/corazon-de-maguey-0.jpg" },
      { name: "corazon-de-maguey-1", url: "images/corazon-de-maguey-1.jpg" },
      { name: "corazon-de-maguey-2", url: "images/corazon-de-maguey-2.jpg" },
    ],
  },
];
