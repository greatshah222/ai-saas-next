import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
	try {
		const { userId } = auth();
		const user = await currentUser();

		if (!user || !userId) {
			return new NextResponse("Unautorized", {
				status: 401,
			});
		}
		const userSubscription = await prismadb.userSubscription.findUnique({
			where: {
				userId,
			},
		});

		if (userSubscription && userSubscription?.stripeCustomerId) {
			// THIS MEASN USER IF TRYING TO CANCEL THE SUBSCRIPTION

			const stripeSession = await stripe.billingPortal.sessions.create({
				customer: userSubscription.stripeCustomerId,
				return_url: settingsUrl,
			});

			return new NextResponse(
				JSON.stringify({
					url: stripeSession.url,
				})
			);
		}

		// USER WANTS TO BUY

		const stripeSession = await stripe.checkout.sessions.create({
			success_url: settingsUrl,
			cancel_url: settingsUrl,
			payment_method_types: ["card"],
			mode: "subscription",
			billing_address_collection: "auto",
			customer_email: user.emailAddresses[0].emailAddress,
			line_items: [
				{
					price_data: {
						currency: "USD",
						product_data: {
							name: "Genius Pro",
							description: "Unlimited AI Generations",
						},
						unit_amount: 2000,
						recurring: {
							interval: "month",
						},
					},
					quantity: 1,
				},
			],
			metadata: {
				userId, // THIS IS NECCESSARY WHEN USER RETURNS FROM STRIPE WE USE THIS TO MARK OUR DB
			},
		});

		return new NextResponse(JSON.stringify({ url: stripeSession.url }));
	} catch (error) {
		console.log("[STRIPE_ERROR]", error);

		return new NextResponse("Internal Error", {
			status: 500,
		});
	}
}
