import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function Component() {
  const [pokemonData, setPokemonData] = useState([])

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch("/api/getPokemon", { // Replace with your actual API route
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collection: "pokemon_cards",
            database: "employee_db",
            dataSource: "Cluster0",
          }),
        })
        const data = await response.json()
        setPokemonData(data.documents)
      } catch (error) {
        console.error("Error fetching Pokemon data:", error)
      }
    }

    fetchPokemonData()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {pokemonData.map((pokemon, index) => (
          <Card key={index}>
            {pokemon.imageUrl && (
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  width={400}
                  height={300}
                  className="object-cover w-full h-60"
                  style={{ aspectRatio: "400/300", objectFit: "cover" }}
                />
              </div>
            )}
            <CardContent className="p-4 bg-background">
              <h3 className="text-lg font-semibold">{pokemon.name}</h3>
              <p className="text-sm text-muted-foreground">Type: {pokemon.types.join(", ")}</p>
              <p className="text-sm text-muted-foreground">HP: {pokemon.hp}</p>
              <h4 className="text-md font-semibold mt-2">Attacks:</h4>
              {pokemon.attacks.map((attack, idx) => (
                <div key={idx}>
                  <p className="text-sm text-muted-foreground">{attack.name}: {attack.damage}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
