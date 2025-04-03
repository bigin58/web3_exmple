import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
// console.log(process.env.WalletConnectId)
export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '419aa8865c37ef6be67f13bf1fc81b22',
  chains: [
    mainnet,
    sepolia,
  ],
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/f2d9d76bfabb40f99bda8235ab2c6165')
  },
  ssr: true,
});