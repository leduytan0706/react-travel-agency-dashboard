import {Account, Client, Databases, Storage} from "appwrite";

export const appwriteConfig = {
    endpointUrl: import.meta.env.VITE_APPWRITE_API_ENDPOINT,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    apiKey: import.meta.env.VITE_APPWRITE_API_KEY,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    tripsCollectionId: import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION_ID
};

// Config appwrite client and connect to the API endpoint and project
const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export {client, account, database, storage};