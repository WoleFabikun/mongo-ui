"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Component() {
  const [series, setSeries] = useState("")
  const [rarity, setRarity] = useState("")
  const [type, setType] = useState("")
  const [pokemon, setPokemon] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/getPokemon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ series, rarity, type }),  // Only send series, rarity, and type
      });
      const data = await response.json();
      if (data.documents && data.documents.length > 0) {
        setPokemon(data.documents[0]);
      } else {
        setPokemon(null);
      }
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      setPokemon(null);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#f0f0f0] to-[#e0e0e0]">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Pokemon Search</CardTitle>
          <CardDescription>Query Pokemon based on Series, Rarity, and Type.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="mb-6 space-y-4">
            <Select onValueChange={setSeries}>
              <SelectTrigger>
                <SelectValue placeholder="Select Series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sun & Moon">Sun & Moon</SelectItem>
                <SelectItem value="Sword & Shield">Sword & Shield</SelectItem>
                {/* Add more series as needed */}
              </SelectContent>
            </Select>

            <Select onValueChange={setRarity}>
              <SelectTrigger>
                <SelectValue placeholder="Select Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Common">Common</SelectItem>
                <SelectItem value="Uncommon">Uncommon</SelectItem>
                <SelectItem value="Rare">Rare</SelectItem>
                {/* Add more rarities as needed */}
              </SelectContent>
            </Select>

            <Select onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Grass">Grass</SelectItem>
                <SelectItem value="Fire">Fire</SelectItem>
                <SelectItem value="Water">Water</SelectItem>
                {/* Add more types as needed */}
              </SelectContent>
            </Select>

            <Button type="submit" className="mt-4 w-full">
              Search
            </Button>
          </form>
          {pokemon && (
            <div className="grid grid-cols-2 gap-4">
              {pokemon.imageUrl && (
                <img
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  width={200}
                  height={200}
                  className="rounded-lg"
                  style={{ aspectRatio: "200/200", objectFit: "cover" }}
                />
              )}
              <div>
                <h3 className="text-xl font-bold">{pokemon.name}</h3>
                <p className="text-gray-500 mb-2">Type: {pokemon.types.join(", ")}</p>
                <p className="text-gray-500 mb-2">HP: {pokemon.hp}</p>
                <div className="grid grid-cols-2 gap-2">
                  {pokemon.attacks.map((attack, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="font-medium">{attack.name}:</span>
                      <span className="ml-2">{attack.damage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!pokemon && (
            <p className="text-gray-500">No Pokémon found with the selected criteria.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
