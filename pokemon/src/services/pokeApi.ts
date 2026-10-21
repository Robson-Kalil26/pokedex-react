import type { Pokemon, Evolucao } from "../types/pokemon";

const URL_BASE = "https://pokeapi.co/api/v2";

interface PokemonApiResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string | null };
  species: { url: string };
}

interface SpeciesApiResponse {
  evolution_chain: { url: string };
}

interface ChainLink {
  species: { name: string };
  evolves_to: ChainLink[];
}

interface EvolutionChainApiResponse {
  chain: ChainLink;
}

export async function buscarPokemon(nome: string): Promise<Pokemon> {
  const resposta = await fetch(`${URL_BASE}/pokemon/${nome}`);
  if (!resposta.ok) {
    throw new Error("Pokémon não encontrado.");
  }
  const dados = (await resposta.json()) as PokemonApiResponse;

  const especie = (await (await fetch(dados.species.url)).json()) as SpeciesApiResponse;

  const cadeia = (await (
    await fetch(especie.evolution_chain.url)
  ).json()) as EvolutionChainApiResponse;

  const nomes: string[] = [];
  let atual: ChainLink | undefined = cadeia.chain;
  while (atual) {
    nomes.push(atual.species.name);
    atual = atual.evolves_to[0];
  }

  const evolucoes: Evolucao[] = await Promise.all(
    nomes.map(async (n) => {
      const r = await fetch(`${URL_BASE}/pokemon/${n}`);
      const d = (await r.json()) as PokemonApiResponse;
      return { id: d.id, nome: d.name, imagem: d.sprites.front_default };
    })
  );

  return {
    id: dados.id,
    nome: dados.name,
    imagem: dados.sprites.front_default,
    altura: dados.height,
    peso: dados.weight,
    evolucoes,
  };
}