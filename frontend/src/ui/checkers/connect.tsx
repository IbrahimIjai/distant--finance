"use client";

import { FC } from "react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Button, ButtonProps } from "@/components/ui/button";

const Connect: FC<ButtonProps> = ({ children, ...props }) => {
	const isMounted = useIsMounted();
	const { open } = useAppKit();
	const { isDisconnected, isConnecting, isReconnecting } = useAccount();

	if (!isMounted)
		return (
			<Button {...props}>
				<div className="h-[1ch]" />
			</Button>
		);

	if (isConnecting || isReconnecting) {
		return (
			<Button disabled {...props}>
				Connecting...
			</Button>
		);
	}

	if (isDisconnected)
		return (
			<Button
				onClick={() => open({ view: "Connect" })}
				className="w-full"
				variant="secondary">
				Connect Wallet
			</Button>
		);

	return <>{children}</>;
};

export { Connect };
