import { NextPage } from "next";
import { Box, Typography, Grid, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState, useEffect, useMemo } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { useStakeContract } from "../../hooks/useContract";
import { Pid } from "../../utils";
import { formatUnits, parseUnits } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { toast } from "react-toastify";


type UserStakeData = {
    staked: string,
    withdrawPending: string,
    withdrawable: string
}

const InitData = {
    staked: '0',
    withdrawPending: '0',
    withdrawable: '0'
}

const Withdraw: NextPage = () => {

    const [userData, setUserData] = useState<UserStakeData>(InitData)
    const [amount, setAmount] = useState('')
    const [unstakeLoading, setUnstakeLoading] = useState(false)
    const [withdrawLoading, setWithdrawLoading] = useState(false)
    const { address, isConnected } = useAccount()
    const stakeContract = useStakeContract() // 获取质押合约实例
    const { data } = useWalletClient()
    // 判断是否可提现
    const isWithdrawable = useMemo(() => {
        return Number(userData.withdrawable) > 0 && isConnected
    }, [userData, isConnected])

    // 解质押
    const handleUnStake = async () => {
        // 判断是否存在质押合约实例和钱包实例
        if (!stakeContract || !data) return;
        // 判断输入金额是否大于0
        if (Number(amount) <= 0) {
            toast.error('Amount must be greater than 0')
            return
        }
        // 判断输入金额是否大于质押金额
        if (Number(amount) > Number(userData.staked)) {
            toast.error('Amount must be less than the staked amount')
            return
        }
        try {
            setUnstakeLoading(true)
            // 调用unstake方法进行解质押
            const tx = await stakeContract.write.unstake([Pid, parseUnits(amount, 18)])
            // 等待交易确认
            const res = await waitForTransactionReceipt(data, { hash: tx })
            if (res.status === 'success') {
                toast.success('Transaction receipt !')
                setUnstakeLoading(false)
                setAmount('')
                getUserData()
            }
        } catch (error) {
            console.log(error, 'stake-error')
        }
    }
    
    // 获取用户质押数据
    const getUserData = async () => {
        // 判断是否存在质押合约实例和账户地址
        if (!stakeContract || !address) return;
        // 读取合约调用stakingBalance方法获取质押金额
        const staked = await stakeContract.read.stakingBalance([Pid, address])
        // 读取合约调用withdrawAmount方法获取可提现金额
        const withdrawAmountResult = await stakeContract.read.withdrawAmount([Pid, address]);
        const [requestAmount, pendingWithdrawAmount] = withdrawAmountResult as [bigint, bigint];
        // 设置用户质押数据
        const ava = Number(formatUnits(pendingWithdrawAmount, 18))
        const p = Number(formatUnits(requestAmount, 18))
        setUserData({
            staked: formatUnits(staked as bigint, 18),
            withdrawPending: (p - ava).toFixed(4),
            withdrawable: ava.toString()
        })
    }

    // 提现
    const handleWithdraw = async () => {
        if (!stakeContract || !data) return;
        try {
            setWithdrawLoading(true)
            // 调用withdraw方法进行提现
            const tx = await stakeContract.write.withdraw([Pid])
            // 等待交易确认
            const res = await waitForTransactionReceipt(data, { hash: tx })
            if (res.status === 'success') {
                toast.success('Transaction receipt !')
                setWithdrawLoading(false)
                getUserData()
            }
        } catch (error) {
            console.log(error, 'withdraw-error')
        }
        
    }

    useEffect(() => {
        if (stakeContract && address) {
            getUserData()
        }
    }, [address, stakeContract])

    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'}>
            <Typography sx={{ fontSize: '30px', fontWeight: 'bold' }}>Rcc Stake</Typography>
            <Typography sx={{}}>Stake ETH to earn tokens.</Typography>
            <Box sx={{ border: '1px solid #eee', borderRadius: '12px', p: '20px', width: '600px', mt: '30px' }}>
                <Grid container sx={{
                    mb: '60px',
                    '& .title': {
                        fontSize: '15px',
                        mb: '5px'
                    },
                    '& .val': {
                        fontSize: '18px',
                        fontWeight: 'bold'
                    }
                }}>
                    <Grid item xs={4}>
                        <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                            <Box className='title'>Staked Amount: </Box>
                            <Box className='val'>{userData.staked} ETH</Box>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                            <Box className='title'>Available to withdraw </Box>
                            <Box className='val'>{userData.withdrawable} ETH</Box>
                        </Box>
                    </Grid><Grid item xs={4}>
                        <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                            <Box className='title'>Pending Withdraw: </Box>
                            <Box className='val'>{userData.withdrawPending} ETH</Box>
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ fontSize: '20px', mb: '10px' }}>Unstake</Box>
                <TextField onChange={(e) => {
                    setAmount(e.target.value)
                }} sx={{ minWidth: '300px' }} label="Amount" variant="outlined" value={amount} />
                <Box mt='20px'>
                    <LoadingButton disabled={!isConnected} variant='contained' loading={unstakeLoading} onClick={handleUnStake}>UnStake</LoadingButton>
                </Box>
                <Box sx={{ fontSize: '20px', mb: '10px', mt: '40px' }}>Withdraw</Box>
                <Box> Ready Amount: {userData.withdrawable} </Box>
                <Typography fontSize={'14px'} color={'#888'}>After unstaking, you need to wait 20 minutes to withdraw.</Typography>
                <LoadingButton loading={withdrawLoading} disabled={!isWithdrawable} sx={{ mt: '20px' }} onClick={handleWithdraw} >Withdraw</LoadingButton>
            </Box>
        </Box>
    )
}
export default Withdraw