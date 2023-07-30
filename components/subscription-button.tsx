"use client";

import { Zap } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";

interface SubscriptionButtonProps {
	isPro: boolean;
}

export const SubscriptionButton = ({ isPro = false }: SubscriptionButtonProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const onClick = async () => {
		try {
			setIsLoading(true);
			const res = await axios.get("/api/stripe"); // everything is handled on back end

			window.location.href = res?.data?.url;
		} catch (error) {
			console.log("BILLING ERROR", error);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Button variant={isPro ? "default" : "premium"} onClick={onClick} disabled={isLoading}>
			{isPro ? "Manage Subscription" : "Upgrade"}

			{!isPro && <Zap className="w-4 h-4 fill-white ml-2" />}
		</Button>
	);
};
