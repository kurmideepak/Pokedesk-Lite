import { Pokemon, PokemonListResponse, TypeResponse, NamedAPIResource } from './types';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

// Fetches the initial list of ALL pokemon names. This is better for filtering.
export async function fetchAllPokemonNames(): Promise<NamedAPIResource[]> {
  // Fetching a large number to get all pokemon, PokeAPI has a high limit.
  const response = await fetch(`${API_BASE_URL}/pokemon?limit=1302`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon list');
  }
  const data: PokemonListResponse = await response.json();
  return data.results;
}

export async function fetchPokemonDetails(name: string): Promise<Pokemon> {
  const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon details for ${name}`);
  }
  return response.json();
}

export async function fetchPokemonTypes(): Promise<NamedAPIResource[]> {
    const response = await fetch(`${API_BASE_URL}/type`);
    if (!response.ok) {
        throw new Error('Failed to fetch Pokémon types');
    }
    const data = await response.json();
    // Filter out unused types if any
    return data.results.filter((type: NamedAPIResource) => type.name !== 'unknown' && type.name !== 'shadow');
}

export async function fetchPokemonsByType(typeUrl: string): Promise<NamedAPIResource[]> {
    const response = await fetch(typeUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch pokemons by type');
    }
    const data: TypeResponse = await response.json();
    return data.pokemon.map(p => p.pokemon);
}