import { ID, OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, database } from "./client";
import { redirect } from "react-router";

// Authenticate user by Google OAuth2
export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session(
            OAuthProvider.Google,
            `${window.location.origin}/`,
            `${window.location.origin}/404`
        );
    } catch (error) {
        console.log("Error in loginWithGoogle: ",error);
    }
};

// Get the user information
export const getUser = async () => {
    try {
        const user = await account.get();

        if (!user) return redirect('/sign-in');

        // get the user document
        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [
                Query.equal('accountId',user.$id),
                Query.select(['name','email','joinedAt','imageUrl','accountId'])
            ]
        )

        return documents.length > 0? documents[0]: redirect("/sign-in");
    } catch (error) {
        console.log("Error in getUser: ",error);
        return null;
    }
};

export const getGooglePicture = async (accessToken: string) => {
    try {
        // get the photo from the google people api with the OAuth token
        const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=photos",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        if (!response.ok){
            throw new Error("Failed to fetch profile photo from Google People API");
        }

        // extract photoUrl from reponse data
        const { photos } = await response.json();
        return photos?.[0]?.url || null;

    } catch (error) {
        console.log("Error in getGooglePicture: ",error);
        return null;
    }
}

export const logoutUser = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        console.log("Error in logoutUser: ",error);
    }
};

export const storeUserData = async () => {
    try {
        const user = await account.get();

        if (!user) throw new Error("User not found.");

        // get the current user session
        const session = await account.getSession('current');

        // get the access token from session
        const oAuthToken = session.providerAccessToken;

        if (!oAuthToken){
            throw new Error("No OAuth token provided.");
        }

        // get google profile picture
        const imageUrl = await getGooglePicture(oAuthToken);

        // check if user already exists
        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [
                Query.equal('accountId', user.$id)
            ]
        );

        if (documents.length > 0) return documents[0];

        

        // create new user
        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: imageUrl || "",
                joinedAt: new Date().toISOString()
            }
        );

        if (!newUser.$id) redirect("/sign-in");
    } catch (error) {
        console.log("Error in storeUserData: ",error);
    }
};

export const getExistingUser = async (id: string) => {
    try {
        // check user existence
        const {documents, total} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [
                Query.equal('accountId', id)
            ]
        );

        return total > 0? documents[0]: null;
    } catch (error) {
        console.log("Error in getExistingUser: ",error);
        return null;
    }
};

export const getAllUsers = async (limit: number, offset: number) => {
    try {
        const {documents: users, total} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            // limit + offset => pagination
            // e.q: limit = 10, offset = 5 => 2 pages
            [
                Query.limit(limit),
                Query.offset(offset)
            ]
        );

        if (total === 0) return {
            users: [],
            total
        };
        // console.log(users);

        return {users, total};
    } catch (error) {
        console.log("Error fetching users:", error);
        return { users: [], total: 0};
    }
};