import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
	apiKey: process.env.OPENAPI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// THIS BELOW WILL BE THE FIRST MEESAGE WHICH WILL BE PASSED TO BOT IN ADDITION OF USER MESSAGE . THIS IS SPECIALLY TELLING YOU ARE A CODE GENERATOR AND NOT SOME RANDOM DISCUSSION

const instructionMessage: ChatCompletionRequestMessage = {
	role: "system",
	content:
		"You are a code generator. You must only answer only in markdown code snippets. Use code commensts for explanations.",
};

export async function POST(req: Request) {
	try {
		const { userId } = auth();

		const body = await req.json();

		const { messages } = body;

		if (!userId) {
			return new NextResponse("Unauthorized", {
				status: 401,
			});
		}

		if (!configuration.apiKey) {
			return new NextResponse("OpenAI API key not configured", {
				status: 500,
			});
		}
		if (!messages) {
			return new NextResponse("Messages are required", {
				status: 400,
			});
		}

		const res = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [instructionMessage, ...messages], // PASSING OUR CODE INSTRUCTION FIRST
		});
		console.log("res", res);
		return NextResponse.json(res?.data?.choices?.[0]?.message);
	} catch (error) {
		console.log("[CODE_ERROR]", error);

		return new NextResponse("Internal Error", {
			status: 500,
		});
	}
}
