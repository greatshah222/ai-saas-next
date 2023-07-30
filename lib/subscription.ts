import { auth } from "@clerk/nextjs";
import prismadb from "./prismadb";

const DAY_IN_MS = 86_400_000;
export const checkSubscription = async () => {
	const { userId } = auth();

	if (!userId) return false;

	const userSubscription = await prismadb.userSubscription.findUnique({
		where: {
			userId,
		},
		select: {
			stripeCurrentPeriodEnd: true,
			stripeSubscriptionId: true,
			stripeCustomerId: true,
			stripePriceId: true,
		},
	});

	if (!userSubscription) return false;
	// CHECKING IF SUBSCRIPTION IS VALID we are giving 1 extra day to user
	const isValid =
		userSubscription.stripePriceId &&
		userSubscription?.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

	return !!isValid; // to change into boolean
};
