'use client'
import { clientEnv } from '@/utils/config/clientEnv'
import { addEnsContracts } from '@ensdomains/ensjs'
import { getRecords } from '@ensdomains/ensjs/public'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
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
    } catch {}

    if(ens.endsWith('.letstalk.eth') && !hasEthCoin){
        return false
    }
    // console.log(ens, resolver, hasEthCoin)
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

type UseEnsIsRegisteredOptions = Omit<UseQueryOptions<boolean, Error, boolean, string[]>, 'queryKey' | 'queryFn'>

export const useEnsIsRegistered = (ens: string, options?: UseEnsIsRegisteredOptions) => {
    const query = useQuery({
        queryKey: buildEnsIsRegistered(ens),
        queryFn: () => checkEnsIsRegistered(ens),
        enabled: (options?.enabled ?? true) && !!ens,
        ...options,
    })

    return {
        isRegistered: query.data,
        isIsRegisteredLoading: query.isPending,
    }
}