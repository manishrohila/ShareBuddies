import { connectToDB } from "@utils/database";
import Ride from "@models/ride";


export const GET = async (request) => {
  try {
    await connectToDB();
    const currentDate = new Date();
    const rides = await Ride.find({time:{ $gte: currentDate }}).populate({
      path: "creator"
    });
  

    const response = new Response(JSON.stringify(rides), {
      status: 200,
    });

    // Add a unique identifier to the URL to force a cache-busting reload
    const url = new URL(request.url);
    url.searchParams.set("t", Date.now());
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Location", url.toString());

    return response;

  } catch (error) {
    return new Response("Failed to fetch all rides", { status: 500 });
  }
}
