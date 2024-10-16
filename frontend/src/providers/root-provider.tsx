import { ReactNode } from "react";
import WagmiContextProvider from "./web3-wagmi";
import { ThemeProvider } from "./theme-provider";

export default function RootProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        // themes={["dark"]}
        forcedTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <WagmiContextProvider cookies={cookies}>
          {children}
        </WagmiContextProvider>
      </ThemeProvider>
    </>
  );
}
