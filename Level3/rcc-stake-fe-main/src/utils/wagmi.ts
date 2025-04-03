import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
// from https://cloud.walletconnect.com/
const ProjectId = '419aa8865c37ef6be67f13bf1fc81b22'

export const config = getDefaultConfig({
  appName: 'Rcc Stake',
  projectId: ProjectId,
  chains: [
    sepolia
  ],
  transports: {
    // 替换之前 不可用的 https://rpc.sepolia.org/
    [sepolia.id]: http(`https://sepolia.infura.io/v3/f2d9d76bfabb40f99bda8235ab2c6165`)
  },
  ssr: true,
});

export const defaultChainId: number = sepolia.id