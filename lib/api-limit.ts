import { auth } from "@clerk/nextjs";
import prismadb from "./prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLimit = async () => {
	const { userId } = auth();

	if (!userId) return;

	const userApiLimit = await prismadb.userApiLimit.findUnique({
		where: {
			userId,
		},
	});

	if (userApiLimit) {
		// UPDATE ITS COUNT

		await prismadb.userApiLimit.update({
			where: {
				userId,
			},

			data: {
				count: userApiLimit?.count + 1,
			},
		});
	} else {
		// ADD COUNT FOR THE FIRST TIME

		await prismadb.userApiLimit.create({
			data: {
				userId,
				count: 1,
			},
		});
	}
};

export const checkApiLimit = async () => {
	const { userId } = auth();
	if (!userId) return false;

	const userApiLimit = await prismadb.userApiLimit.findUnique({
		where: {
			userId,
		},
	});

	if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
		return true;
	} else {
		return false;
	}
};

export const getApiLimitCount = async () => {
	const { userId } = auth();

	if (!userId) return 0;

	const userApiLimit = await prismadb.userApiLimit.findUnique({
		where: {
			userId,
		},
	});

	if (!userApiLimit) {
		// USER HAVE NEVER USED  IT
		return 0;
	} else {
		return userApiLimit?.count;
	}
};
