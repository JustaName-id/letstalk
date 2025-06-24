'use client'
import { clientEnv } from '@/utils/config/clientEnv'
import { addEnsContracts } from '@ensdomains/ensjs'
import { getRecords } from '@ensdomains/ensjs/public'
import { useQuery } from '@tanstack/react-query'
import { createPublicClient, http } from 'viem'
import { mainnet, sepolia } from 'wagmi/chains'

export const client = createPublicClient({
    chain: addEnsContracts(
        clientEnv.chainId === 1 ? mainnet : sepolia,
    ),
    transport: http(clientEnv.providerUrl),
})

export const buildEnsIsRegistered = (ens: string) => ['ENS_IS_REGISTERED', ens]

export const checkEnsIsRegistered = async (ens: string) => {
    let resolver = ''
    let hasEthCoin = false
    const ensEndsWithEth = ens.endsWith('.eth')
    try {
        const ensOwner = await getRecords(client, {
            name: ens,
            coins: ['ETH'],
        })
        resolver = ensOwner?.resolverAddress || ''
        hasEthCoin = !!ensOwner?.coins.find((coin) => coin.id === 60)
    } catch (e) {}

    if (
        !!resolver &&
        resolver !== '0x0000000000000000000000000000000000000000'
    ) {
        if (ensEndsWithEth) {
            return true
        } else {
            return hasEthCoin
        }
    } else {
        return false
    }
}

export const useEnsIsRegistered = (ens: string) => {
    const query = useQuery({
        queryKey: buildEnsIsRegistered(ens),
        queryFn: () => checkEnsIsRegistered(ens),
        enabled: !!ens,
    })

    return {
        isRegistered: query.data,
        isIsRegisteredLoading: query.isPending,
    }
}
