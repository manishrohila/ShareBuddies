import { connectToDB } from "@utils/database";
import Ride from "@models/ride";
import User from "@models/user";

export const GET = async (request, { params }) => {
    try {
        await connectToDB();
       const currentDate = new Date();

        const rides = await Ride.find({
            creator: params.id,
        }).populate('creator');

        const ridesjoined = await Ride.find({
            "participants.userId": params.id
        }).populate('participants.userId creator');
        const allrides = rides.concat(ridesjoined);
        const joinedrides = ridesjoined.filter(r => r.time > currentDate);
        const createdrides = rides.filter(r => r.time > currentDate);
        const completedrides = allrides.filter(r => r.time <= currentDate);

        return new Response(JSON.stringify({ createdrides, joinedrides,completedrides}), { status: 200 });

    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 });
    }
}