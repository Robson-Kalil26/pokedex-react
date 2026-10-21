import { useState } from "react";
import type { FormEvent } from "react";

interface SearchBarProps {
  onBuscar: (termo: string) => void;
}

export default function SearchBar({ onBuscar }: SearchBarProps) {
  const [valor, setValor] = useState("");

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onBuscar(valor.toLowerCase().trim());
  }

  return (
    <form className="search-bar" onSubmit={enviar}>
      <input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Nome ou número do Pokémon"
      />
      <button type="submit">Buscar</button>
    </form>
  );
}