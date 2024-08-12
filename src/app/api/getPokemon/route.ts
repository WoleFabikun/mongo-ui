// app/api/getPokemon/route.js

export async function POST(req) {
  try {
    const { series, rarity, type } = await req.json();

    // Build the MongoDB query based on provided criteria
    const matchQuery = {};

    if (series) {
      matchQuery.series = series;
    }
    if (rarity) {
      matchQuery.rarity = rarity;
    }
    if (type) {
      matchQuery.types = type;  // Assuming `types` is an array and we're matching on a single type
    }

    const response = await fetch("https://us-east-1.aws.data.mongodb-api.com/app/data-auclety/endpoint/data/v1/action/aggregate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.MONGODB_API_KEY,
      },
      body: JSON.stringify({
        collection: "pokemon_cards",
        database: "employee_db",
        dataSource: "Cluster0",
        pipeline: [
          { $match: matchQuery }  // Apply the built query to the match stage
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from MongoDB API:", errorText);
      return new Response(JSON.stringify({ error: "Failed to fetch data from MongoDB API" }), { status: 500 });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data from MongoDB" }), { status: 500 });
  }
}
