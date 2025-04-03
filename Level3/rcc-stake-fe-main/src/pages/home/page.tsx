import { Box, TextField, Typography } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { useAccount, useBalance, useWalletClient } from "wagmi";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { useStakeContract } from "../../hooks/useContract";
import { formatUnits, parseUnits } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { NextPage } from "next";


const Home: NextPage = () => {
    const stakeContract = useStakeContract() // 获取合约实例
    const { address, isConnected } = useAccount()
    const [stakedAmount, setStakedAmount] = useState('0') // 质押的金额
    const [amount, setAmount] = useState('') // 输入的质押金额
    const [loading, setLoading] = useState(false)
    const { data } = useWalletClient() // 获取钱包实例
    // 获取账户余额
    const { data: balance } = useBalance({
        address: address,
    })
    console.log(balance, 'balance')
    // 获取质押金额
    useEffect(() => {
        if (stakeContract && address) {
            getStakeAmount()
        }
    }, [stakeContract, address])

    async function handleStake() {
        // 质押逻辑
        // 判断是否有合约实例和钱包实例
        if (!stakeContract || !data) return
        // 判断输入的质押金额是否大于当前用户的余额
        if (parseFloat(amount) > parseFloat(balance!.formatted)) {
            toast.error('Amount cannot be greater than current balance')
            return
        }
        // 向合约注入金额
        try {
            setLoading(true)
            const tx = await stakeContract.write.depositETH([], { value: parseUnits(amount, 18) }) // 调用合约的depositETH方法 转入质押金额
            const res = await waitForTransactionReceipt(data, { hash: tx }) // 等待交易确认
            console.log(tx, 'tx ====>')
            console.log(res, 'res ====>')
            if (res.status === 'success') {
                toast.success('Stake successfully')
                setLoading(false)
                setAmount('')
                getStakeAmount() // 获取质押金额
            }
        } catch (error) {
            setLoading(false)
            console.log(error, 'stake-error')
        }
    }

    // 获取质押金额
    const getStakeAmount = useCallback(async () => {
        // 获取质押金额
        // 判断合约实例和账户地址是否存在
        if (!stakeContract || !address) return
        console.log(stakeContract, 'stakeContract')
        console.log(address, 'address')
        // 调用合约的getStakeAmount方法获取质押金额
        const amount = await stakeContract?.read.stakingBalance([0, address])
        setStakedAmount(formatUnits(amount as bigint, 18))
    }, [stakeContract, address])

    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'}>
            <Typography sx={{ fontSize: '30px', fontWeight: 'bold' }}>Rcc Stake</Typography>
            <Typography sx={{}}>Stake ETH to earn tokens.</Typography>
            <Box sx={{ border: '1px solid #eee', borderRadius: '12px', p: '20px', width: '600px', mt: '30px' }}>
                <Box display={'flex'} alignItems={'center'} gap={'5px'} mb={'10px'}>
                    <Box>Staked Amount: </Box>
                    <Box>{stakedAmount} ETH</Box>
                </Box>
                <TextField value={amount} onChange={(e) => {
                    setAmount(e.target.value)
                }} sx={{ minWidth: '300px' }} label="Amount" variant="outlined" />
                <Box mt='30px'>
                    {/* {
                        !isConnected ? <ConnectButton /> : <LoadingButton variant='contained' loading={loading} onClick={handleStake}>Stake</LoadingButton>
                    } */}
                    <LoadingButton disabled={!isConnected} variant='contained' loading={loading} onClick={handleStake}>Stake</LoadingButton>
                </Box>
            </Box>

        </Box>
    )
}

export default Home