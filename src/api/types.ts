export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: NamedAPIResource;
  }[];
  stats: {
    base_stat: number;
    stat: NamedAPIResource;
  }[];
  abilities: {
    ability: NamedAPIResource;
    is_hidden: boolean;
  }[];
}

export interface TypeResponse {
  pokemon: { pokemon: NamedAPIResource }[];
}