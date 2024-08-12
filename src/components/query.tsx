"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MultiSelectFormField from "@/components/ui/multiSelect"

interface Pokemon {
  name: string;
  imageUrl?: string;
  types?: string[];
  hp?: string;
  ability?: {
    name: string;
    text: string;
  };
  attacks: {
    name: string;
    damage: string;
    text: string;
  }[];
}

export default function Component() {
  const [types, setTypes] = useState<string[]>([])
  const [rarity, setRarity] = useState("")
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]) // Store the list of Pokémon

  const handleSearch = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/getPokemon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ types, rarity }),  // Send types and rarity as filters
      });
      const data = await response.json();
      if (data.documents && data.documents.length > 0) {
        setPokemonList(data.documents); // Store the array of Pokémon
      } else {
        setPokemonList([]);
      }
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      setPokemonList([]);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-b from-[#f0f0f0] to-[#e0e0e0] p-6">
      <Card className="w-screen p-6 bg-white shadow-lg rounded-lg mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Pokemon Search</CardTitle>
          <CardDescription>Query Pokemon based on Types and Rarity.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="mb-6 space-y-4">
            <MultiSelectFormField
              options={[
                { label: "Grass", value: "Grass" },
                { label: "Fire", value: "Fire" },
                { label: "Water", value: "Water" },
                { label: "Electric", value: "Electric" },
                { label: "Psychic", value: "Psychic" },
                { label: "Fighting", value: "Fighting" },
                { label: "Dark", value: "Dark" },
                { label: "Steel", value: "Steel" },
                { label: "Fairy", value: "Fairy" },
                { label: "Dragon", value: "Dragon" },
                // Add more types as needed
              ]}
              placeholder="Select Types"
              onValueChange={setTypes}
            />

            <Button type="submit" className="mt-4 w-full">
              Search
            </Button>
          </form>
          
          {pokemonList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pokemonList.map((pokemon, idx) => (
                <Card key={idx} className="p-4 shadow-lg rounded-lg min-w-[200px]">
                  {pokemon.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pokemon.imageUrl}
                      alt={pokemon.name}
                      className="rounded-lg mb-4 w-full"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  <CardContent>
                    <h3 className="text-xl font-bold mb-2">{pokemon.name}</h3>
                    {pokemon.types && pokemon.types.length > 0 && (
                      <p className="text-gray-500 mb-2">Type: {pokemon.types.join(", ")}</p>
                    )}
                    {pokemon.hp && (
                      <p className="text-gray-500 mb-2">HP: {pokemon.hp}</p>
                    )}
                    {pokemon.ability && (
                      <div className="mb-2">
                        <h4 className="font-semibold">{pokemon.ability.name}</h4>
                        <p className="text-gray-500">{pokemon.ability.text}</p>
                      </div>
                    )}
                    {pokemon.attacks && pokemon.attacks.length > 0 && (
                      <>
                        <h4 className="font-semibold mt-2">Attacks:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {pokemon.attacks.map((attack, attackIdx) => (
                            <div key={attackIdx} className="flex items-center">
                              <span className="font-medium">{attack.name}:</span>
                              <span className="ml-2">{attack.damage}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No Pokémon found with the selected criteria.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
