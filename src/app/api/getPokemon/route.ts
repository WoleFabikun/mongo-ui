import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { types, rarity } = await req.json();

    // Build the MongoDB match stage based on provided criteria
    const matchStage: Record<string, any> = {};


    if (rarity) {
      matchStage.rarity = rarity;
    }
    if (types) {
      matchStage.types = types;
    }

    console.log("Match stage:", matchStage);

    // Define the pipeline for MongoDB aggregation
    const pipeline = [
      { $match: matchStage },  // Apply the match stage based on the user's filters
      // Add additional stages as needed, e.g., $group, $sort, etc.
    ];

    const response = await fetch("https://us-east-1.aws.data.mongodb-api.com/app/data-auclety/endpoint/data/v1/action/aggregate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.MONGODB_API_KEY!,
      },
      body: JSON.stringify({
        collection: "pokemon_cards",
        database: "employee_db",
        dataSource: "Cluster0",
        pipeline: [
      {
        "$match": { "types": types }
      } 
    ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from MongoDB API:", errorText);
      return NextResponse.json({ error: "Failed to fetch data from MongoDB API" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
    return NextResponse.json({ error: "Failed to fetch data from MongoDB" }, { status: 500 });
  }
}
