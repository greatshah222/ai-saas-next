"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
	useEffect(() => {
		Crisp.configure("f3399419-ffe6-48ad-8417-e87a7f1d6ab8");
	}, []);

	return null;
};
