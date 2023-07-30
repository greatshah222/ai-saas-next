import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
	const apiLimitCount = await getApiLimitCount();

	const isPro = await checkSubscription();
	console.log("apiLimitCunt", apiLimitCount);
	return (
		<div className="relative h-full">
			<div className="hidden h-full md:flex md:flex-col md:fixed md:inset-y-0  bg-gray-900 md:w-72">
				<Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
			</div>

			<main className="md:pl-72">
				<Navbar />

				{children}
			</main>
		</div>
	);
};

export default DashboardLayout;
