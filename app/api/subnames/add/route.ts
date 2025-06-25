import { NextRequest, NextResponse } from 'next/server';
import { getJustaname } from '@/lib/justaname';
import { serverEnv } from '@/utils/config/serverEnv';
import {normalize} from "viem/ens"

export const POST = async (req: NextRequest) => {
    const { username, ensDomain, address, signature, message } = await req.json();

    if (!username || !ensDomain || !address || !signature || !message) {
      return NextResponse.json({ message: "Required fields are missing" }, { status: 400 });
    }

    const justaname = getJustaname();
    //
    // const existingNames = await justaname.subnames.getSubnamesByAddress({
    //   address,
    //   isClaimed: true,
    //   chainId: serverEnv.chainId,
    //   coinType: 60,
    // });
  
    // if (existingNames.subnames.find((name) => name.ens.endsWith(`.${normalize(ensDomain)}`))) {
    //   return NextResponse.json({ message: "Address already claimed" }, { status: 400 });
    // }
  
    try {
      const result = await justaname.subnames.addSubname(
        { username, ensDomain: normalize(ensDomain), chainId: serverEnv.chainId },
        { xSignature: signature, xAddress: address, xMessage: message }
      );
  
      return NextResponse.json(result);

    } catch (error) {
        console.log(error);
      return NextResponse.json({ error: error instanceof Error ? error.message : "Error" }, { status: 500 });
    }
};
