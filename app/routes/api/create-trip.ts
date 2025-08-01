import { GoogleGenerativeAI } from "@google/generative-ai";
import { ID } from "appwrite";
import { data, type ActionFunctionArgs } from "react-router";
import { appwriteConfig, database } from "~/appwrite/client";
import { parseMarkdownToJson } from "~/lib/utils";

// function (server) action for CreateTripForm
export const action = async ({request}: ActionFunctionArgs) => {
    const {
        country,
        duration,
        travelStyle,
        interest, 
        groupType,
        budget,
        userId
    } = await request.json();

    // !: to ensure that the value will be there
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

    try {
        // AI prompt to create travel plan
        const prompt = `
        Generate a ${duration}-day travel itinerary for ${country} based on the following user information:
        Budget: '${budget}'
        Interests: '${interest}'
        TravelStyle: '${travelStyle}'
        GroupType: '${groupType}'
        Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
        {
            "name": "A descriptive title for the trip",
            "description": "A brief description of the trip and its highlights not exceeding 100 words",
            "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
            "duration": ${duration},
            "budget": "${budget}",
            "travelStyle": "${travelStyle}",
            "country": "${country}",
            "interests": ${interest},
            "groupType": "${groupType}",
                "bestTimeToVisit": [
                '🌸 Season (from month to month): reason to visit',
                '☀️ Season (from month to month): reason to visit',
                '🍁 Season (from month to month): reason to visit',
                '❄️ Season (from month to month): reason to visit'
            ],
            "weatherInfo": [
                '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
                '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
                '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
                '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
            ],
            "location": {
                "city": "name of the city or region",
                "coordinates": [latitude, longitude],
                "openStreetMap": "link to open street map"
            },
            "itinerary": [
                {
                    "day": 1,
                    "location": "City/Region Name",
                    "activities": [
                        {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
                        {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
                        {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
                    ]
                },
            ...
            ]
        }
        `;

        // generate content using gemeni
        const textResult = await genAI
            .getGenerativeModel({model: 'gemini-2.0-flash'})
            .generateContent([prompt]);
        
        // console.log(textResult.response.text());
        
        // parse the result from markdown format to json
        const trip = parseMarkdownToJson(textResult.response.text());

        const imageResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${country} ${interest} ${travelStyle}&client_id=${unsplashApiKey}`
        );
        const images = (await imageResponse.json()).results;
        console.log(images);
        const imageUrls = images
            .slice(0,3)
            .map((image: any) => image.urls?.regular || null);

        const result = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripsCollectionId,
            ID.unique(),
            {
                tripDetails: JSON.stringify(trip), 
                userId,
                createdAt: new Date().toISOString(),
                imageUrls
            }
        );

        // React Router - data(): used to return data from server action
        return data({id: result.$id});
    } catch (error) {
        console.error("Error generating AI travel plan: ",error);
    }
};