import { Query } from "appwrite";
import { appwriteConfig, database } from "./client";

export const getAllTrips = async (limit: number, offset: number) => {
    const {documents: trips, total} = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.tripsCollectionId,
        [
            Query.limit(limit),
            Query.offset(offset),
            Query.orderDesc('createdAt')
        ]
    );

    if (total === 0){
        console.error('No trips found.');
        return { trips: [], total: 0 };
    }

    return {
        trips,
        total
    }
};

export const getTripById = async (tripId: string) => {
    const trip = await database.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.tripsCollectionId,
        tripId
    );

    if (!trip.$id){
        console.error('Trip not found.');
        return null;
    }

    return trip;
};