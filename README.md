# Distant Finance 🚀

> **Recharge Your NFT Portfolio with Liquidity**

Distant Finance is a decentralized peer-to-peer (P2P) NFT lending and borrowing platform built on Base blockchain. The platform enables NFT holders to unlock liquidity from their digital assets by using them as collateral for loans, while providing lenders with attractive yield opportunities.

## 🌟 Features

### For Borrowers
- **NFT Collateralization**: Lock your ERC-721 NFTs as collateral to secure loans
- **Flexible Loan Terms**: Choose loan duration (7-90 days) and set your preferred interest rates
- **Multiple Payment Options**: Borrow in ETH or WETH
- **Secure Collateral Management**: NFTs are safely held in a dedicated TokenLocker contract
- **Transparent Interest Calculation**: Dynamic interest calculation based on block-based accrual

### For Lenders
- **Competitive Yields**: Earn attractive interest rates on your capital
- **Bidding System**: Propose custom interest rates for loan requests
- **Risk Management**: Collateralized loans with liquidation mechanisms
- **Portfolio Diversification**: Lend across various NFT collections
- **Automated Liquidation**: Protection through time-based liquidation system

### Platform Features
- **Multi-Collection Support**: Support for verified NFT collections
- **Real-time Analytics**: Protocol statistics and performance metrics
- **User Dashboard**: Comprehensive loan management interface
- **Mobile Responsive**: Seamless experience across all devices
- **Dark/Light Mode**: Customizable UI themes

## 🏗️ Architecture

### Smart Contracts (Solidity)

#### Core Contracts
- **`P2PLending.sol`**: Main lending protocol handling loan creation, bidding, and repayment
- **`TokenLocker.sol`**: Secure NFT custody and collateral management
- **`Protocol.sol` (DistantFinance)**: Protocol governance, fee management, and collection verification

#### Key Features
- **ReentrancyGuard**: Protection against reentrancy attacks
- **Pausable**: Emergency pause functionality for security
- **Access Control**: Role-based permissions and admin functions
- **Fee Management**: Configurable protocol and security fees
- **Interest Calculation**: Block-based dynamic interest accrual

### Frontend (Next.js 14)

#### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom components
- **Web3 Integration**: Wagmi + Viem for blockchain interactions
- **Wallet Connection**: Reown AppKit (formerly WalletConnect)
- **UI Components**: Radix UI with custom theming
- **State Management**: Apollo Client for GraphQL data
- **Animations**: Framer Motion for smooth transitions

#### Key Pages
- **Landing Page**: Protocol overview and statistics
- **Dashboard**: User loan management and NFT portfolio
- **Loans Marketplace**: Browse and interact with available loans
- **Swap Interface**: Token exchange functionality

## 📁 Project Structure

```
distant--finance/
├── contracts/                    # Smart contract development
│   ├── contracts/
│   │   ├── P2PLending.sol       # Main lending contract
│   │   ├── TokenLocker.sol      # NFT collateral management
│   │   ├── Protocol.sol         # Protocol governance
│   │   └── interfaces/          # Contract interfaces
│   ├── deploy/                  # Deployment scripts
│   ├── deployments/base/        # Base network deployments
│   └── scripts/                 # Utility scripts
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/                 # App router pages
│   │   ├── components/          # Reusable UI components
│   │   ├── ui/                  # Page-specific components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility functions
│   │   ├── config/              # Configuration files
│   │   └── providers/           # Context providers
│   └── public/                  # Static assets
└── collections/                 # NFT collection metadata
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/IbrahimIjai/distant--finance.git
   cd distant--finance
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Install Contract Dependencies**
   ```bash
   cd ../contracts
   npm install
   ```

4. **Environment Setup**
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_GRAPHQL_ENDPOINT=your_subgraph_endpoint
   
   # Contracts (.env)
   DEPLOYER_PRIVATE_KEY=your_private_key
   BASESCAN_API_KEY=your_basescan_api_key
   ```

### Development

1. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Compile Smart Contracts**
   ```bash
   cd contracts
   npm run compile
   ```

3. **Deploy Contracts (Base Testnet)**
   ```bash
   npm run deploy
   ```

## 🔗 Deployed Contracts (Base Mainnet)

- **P2PLending**: `0x8F4A73208f6D7ccf59cfF8f082B68F72284f7a99`
- **TokenLocker**: `[Contract Address]`
- **DistantFinance Protocol**: `[Contract Address]`

## 🛠️ Technical Specifications

### Smart Contract Features
- **Solidity Version**: ^0.8.20
- **OpenZeppelin Integration**: Security and standard implementations
- **Gas Optimization**: Efficient contract design with optimized operations
- **Upgradeable Architecture**: Proxy pattern for future improvements

### Frontend Technologies
- **Next.js 14**: Modern React framework with server-side rendering
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling framework
- **Wagmi/Viem**: Type-safe Ethereum development
- **Apollo Client**: GraphQL data management
- **Framer Motion**: Animation library

### Security Features
- **Reentrancy Protection**: SafeGuards against common attacks
- **Access Control**: Multi-level permission system
- **Pausable Operations**: Emergency stop functionality
- **Input Validation**: Comprehensive parameter checking
- **Time-based Liquidation**: Automated collateral recovery

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Guidelines

1. **Fork the Repository**
   ```bash
   git fork https://github.com/IbrahimIjai/distant--finance.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Code Standards**
   - Follow existing code style and conventions
   - Add comprehensive tests for new features
   - Update documentation as needed
   - Ensure all tests pass before submitting

4. **Commit Guidelines**
   ```bash
   git commit -m "feat: add new lending feature"
   git commit -m "fix: resolve interest calculation bug"
   git commit -m "docs: update API documentation"
   ```

5. **Submit Pull Request**
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Reference any related issues

### Areas for Contribution

#### Smart Contracts
- **Security Audits**: Help review and improve contract security
- **Gas Optimization**: Optimize contract operations for lower gas costs
- **Feature Development**: Add new lending/borrowing features
- **Testing**: Expand test coverage and edge cases

#### Frontend Development
- **UI/UX Improvements**: Enhance user experience and interface design
- **Mobile Optimization**: Improve mobile responsiveness
- **Performance**: Optimize loading times and interactions
- **Accessibility**: Improve platform accessibility features

#### Documentation
- **API Documentation**: Expand technical documentation
- **User Guides**: Create comprehensive user tutorials
- **Developer Docs**: Improve development setup guides

### Bug Reports & Feature Requests

Please use GitHub Issues to report bugs or request features:
- **Bug Report**: Describe the issue, steps to reproduce, and expected behavior
- **Feature Request**: Explain the feature, use case, and potential implementation

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [https://distant-finance.vercel.app](https://distant-finance.vercel.app)
- **Documentation**: [Coming Soon]
- **Twitter**: [Coming Soon]
- **Discord**: [Coming Soon]

## ⚠️ Disclaimer

This project is experimental and under active development. Use at your own risk. Always do your own research and never invest more than you can afford to lose.

---

**Built with ❤️ by the Distant Finance Team**
