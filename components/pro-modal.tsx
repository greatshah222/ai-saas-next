import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { useProModal } from "@/hooks/use-pro-modal";
import { Badge } from "./ui/badge";
import { tools } from "@/constants";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Check, Zap } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";

export const ProModal = () => {
	const proModal = useProModal();
	const [isLoading, setIsLoading] = useState(false);

	const onSubscribe = async () => {
		try {
			setIsLoading(true);
			const res = await axios.get("/api/stripe");
			window.location.href = res?.data?.url;

			console.log("res", res);
		} catch (error) {
			console.log("STRIPE CLIENT ERROR", error);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
						<div className="flex items-center gap-x-2 font-bold py-1">
							Upgrade to Genius
							<Badge variant={"premium"} className="uppercase text-sm py-1">
								Pro
							</Badge>
						</div>
					</DialogTitle>
					<DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
						{tools.map((el) => (
							<Card
								key={el?.label}
								className="p-3 border-black/5 flex items-center justify-between"
							>
								<div className="flex items-center gap-x-4">
									<div className={cn("p-2 w-fit rounded-md", el?.bgColor)}>
										<el.icon className={(cn("w-6 h-6"), el.color)} />
									</div>
									<div className="font-semibold text-sm">{el.label}</div>
								</div>

								<Check className="text-primary w-5 h-5" />
							</Card>
						))}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant={"premium"}
						size={"lg"}
						className="w-full"
						onClick={onSubscribe}
						disabled={isLoading}
					>
						Upgrade <Zap className="w-4 h-4 ml-2 fill-white" />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
