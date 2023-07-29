import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const BotAvatar = () => {
	const { user } = useUser();
	return (
		<Avatar className="h-8 w-8">
			<AvatarImage src={"/logo.png"} className="p-1" />
		</Avatar>
	);
};

export default BotAvatar;
