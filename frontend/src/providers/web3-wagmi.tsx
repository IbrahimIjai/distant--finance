"use client";

import { wagmiAdapter, projectId, SUBGRAPH_URI } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { base, baseSepolia } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: SUBGRAPH_URI,
  cache: new InMemoryCache(),
});
// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "appkit-example-scroll",
  description: "AppKit Example - Scroll",
  url: "https://scrollapp.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Create the modal
// eslint-disable-next-line
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base, baseSepolia],
  defaultNetwork: baseSepolia,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

function WagmiContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          // @ts-expect-error: type mismatch between base and OnchainKitProvider chain prop
          chain={base}
        >
          <ApolloProvider client={client}>{children}</ApolloProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default WagmiContextProvider;
