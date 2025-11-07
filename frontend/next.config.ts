import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	// cacheComponents: true,
	images: {
		domains: [
			"ipfsfiles.distant.finance",
			"images.remotePatterns",
			"ipfs.raribleuserdata.com",
			"nftmedia.parallelnft.com",
			"api.rarible.org",
		],
	},
};

export default nextConfig;
