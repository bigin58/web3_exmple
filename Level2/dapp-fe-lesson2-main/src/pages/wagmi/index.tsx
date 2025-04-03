import { Box, Typography } from "@mui/material";
import { stakeAbi } from "../../abis/stakeAbi";
import { useAccount, useReadContract, useReadContracts, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Pid, RccStakeContract } from "../../utils";
import { formatUnits, parseEther } from "viem";
import SignMessage from "../../components/wagmi/SignMessage";
import Transfer from "../../components/wagmi/TransferNativeCurrency";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";


export default function Page() {
  const account = useAccount()
  const [loading, setLoading] = useState(false)
  const result = useReadContract({
    abi: stakeAbi,
    address: RccStakeContract,
    functionName: 'stakingBalance',
    args: [BigInt(Pid), account.address!],
    query: { enabled: Boolean(account.address) }
  })

  const { writeContractAsync, status: writeStatus, data } = useWriteContract()
  const confirmRes = useWaitForTransactionReceipt({
    hash: data
  })
  // console.log({ confirmRes })
  const resArr = useReadContracts({
    contracts: [
      {
        abi: stakeAbi,
        address: RccStakeContract,
        functionName: 'endBlock'
      }, {
        abi: stakeAbi,
        address: RccStakeContract,
        functionName: 'startBlock'
      },
    ]
  })

  const handleStake = async () => {
    try {
      setLoading(true)
      const hash = await writeContractAsync({
        abi: stakeAbi,
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        functionName: 'depositETH',
        value: parseEther('0.001')
      })
      // console.log(hash, 'hash')
    } catch (error) {
      console.log(error)
    }
    setLoading(false)

  }

  // console.log({ multiCall: resArr })


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '800px', margin: 'auto', mt: '40px', p: '30px', border: '1px solid #000' }}>
      <Typography component={'h3'}>Deposit</Typography>
      <Box>Staked Amount: {result.data && formatUnits(result.data, 18)}ETH</Box>
      <Box> <LoadingButton loading={loading} onClick={handleStake} variant="contained">Stake 0.001</LoadingButton></Box>
      <Box mt='20px' width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
        <SignMessage />
        <Transfer />
      </Box>
    </Box>
  )
}