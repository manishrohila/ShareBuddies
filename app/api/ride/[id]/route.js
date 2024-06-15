import { connectToDB } from "@utils/database";
import Ride from "@models/ride";
//GET request
export const GET = async (request, { params }) => {
    try {
        await connectToDB();
        const ride = await Ride.findById(params.id).populate('creator');

        if (!ride)
            return new Response("Ride not found", { status: 401 });

        return new Response(JSON.stringify(ride), {
            status: 200
        })
    } catch (error) {
        return new Response("Failed to fetch Ride", { status: 500 });
    }
}

export const PATCH = async (request, { params }) => {
    try {
        const { to, from, time, price, contact, capacity, newParticipant } = await request.json();
        
        await connectToDB();

        const existingRide = await Ride.findById(params.id);
        if (!existingRide) {
            return new Response("Ride not found", { status: 404 });
        }

        if (newParticipant) {
            const participantExists = existingRide.participants.some(
                (participant) => participant.userId.equals(newParticipant.userId)
            );

            if (participantExists) {
                return new Response("You have already joined", { status: 409 });
            }

            existingRide.participants.push(newParticipant);
            existingRide.countppl += 1;

            await existingRide.save();
            return new Response("Successfully joined the ride", { status: 200 });
        }

        existingRide.to = to ?? existingRide.to;
        existingRide.from = from ?? existingRide.from;
        existingRide.time = time ?? existingRide.time;
        existingRide.price = price ?? existingRide.price;
        existingRide.capacity = capacity ?? existingRide.capacity;
        existingRide.contact = contact ?? existingRide.contact;

        await existingRide.save();

        return new Response("Successfully updated the ride", { status: 200 });
    } catch (error) {
        console.error("Failed to update the ride:", error);
        return new Response("Failed to update the ride", { status: 500 });
    }
};


export const DELETE = async (request, { params }) => {

    try {
        await connectToDB();
        await Ride.findByIdAndRemove(params.id);
        return new Response("Ride deleted succesfully", { status: 200 });

    } catch (error) {
        return new Response("Failed to delete Ride", {
            status: 500
        });
    }
}