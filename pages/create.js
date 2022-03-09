import React, {useState} from "react";
import {create as ipfsHttpClient} from "ipfs-http-client";
import {useRouter} from "next/router";
import {ethers} from "ethers";
import Token from "../artifacts/contracts/Token.sol/Token.json"
import JohnyMarket from "../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json"
import Web3Modal from "web3modal";
import {marketAddress, tokenAddress} from "../config";
import {Button, Form, Input, InputNumber, message} from 'antd';
import 'antd/dist/antd.css';
import {useTranslation} from "../utils/use-translations";
import {FaEthereum} from 'react-icons/fa';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function Create() {
    const [fileURL, setFileURL] = useState(null)
    const [formInput, updateFormInput] = useState({price: "", name: "", description: ""})
    const router = useRouter()
    const {t} = useTranslation()

    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            message.success(`File ${file.name} was uploaded successfully!`)
            setFileURL(url)
        } catch (error) {
            console.log(error)
            message.error('Error uploading file')
        }
    }

    async function uploadImageToIPSF() {
        //Validate form data
        const {name, description, price} = formInput
        if (!name) {
            message.error("NFT Name is missing");
            return;
        }
        if (!description) {
            message.error("Description is missing");
            return;
        }
        if (!price) {
            message.error("NFT Price is missing");
            return;
        }
        if (!fileURL) {
            message.error("Image is missing");
            return;
        }

        //Stringify data from JSON
        const data = JSON.stringify({
            name, description, image: fileURL
        })

        //Get file from IPFS URL -> create sale
        try {
            const addedFile = await client.add(data)
            const ipfsFileUrl = `https://ipfs.infura.io/ipfs/${addedFile.path}`
            return ipfsFileUrl;
        } catch (e) {
            console.log(e)
        }
    }

    async function createNFTSale() {
        //Get uploaded file URl
        try {
            const ipfsFileUrl = await uploadImageToIPSF()

            //Connect to Web3Modal -> get signer
            const w3m = new Web3Modal()
            const w3mConnection = await w3m.connect()
            const w3mProvider = new ethers.providers.Web3Provider(w3mConnection)
            const w3mSigner = w3mProvider.getSigner()

            //Connect to token contract -> mint new token from the URL -> get the token
            let tokenContract = new ethers.Contract(tokenAddress, Token.abi, w3mSigner)
            let transaction = await tokenContract.mintToken(ipfsFileUrl)
            let transactionOutput = await transaction.wait()
            let tokenID = ((transactionOutput.events[0]).args[2]).toNumber()

            //Get listed price from Form
            const price = ethers.utils.parseUnits(formInput.price, 'ether')

            //Connect to market contract -> get default token price
            let marketContract = new ethers.Contract(marketAddress, JohnyMarket.abi, w3mSigner)
            let tokenPrice = await marketContract.getTokenPrice()
            tokenPrice = tokenPrice.toString()

            //Deploy NFT to Market
            transaction = await marketContract.createMarketNFT(
                tokenAddress, tokenID, price, {value: tokenPrice}
            )

            //Reroute back to dashboard
            await transaction.wait()
            await router.push('/')
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Form
            name="basic"
            labelCol={{span: 8}}
            wrapperCol={{span: 10}}
            autoComplete={"off"}>

            <Form.Item
                name={"nft-name"}
                label={t("Name")}
                rules={[{required: true, message: 'Please input NFT name!'}]}>
                <Input
                    onChange={e => updateFormInput({...formInput, name: e.target.value})}/>
            </Form.Item>

            <Form.Item
                name={"nft-description"}
                label={t("Description")}
                rules={[{required: true, message: 'Please insert description of NFT!'}]}>
                <Input.TextArea
                    onChange={e => {
                        updateFormInput({...formInput, description: e.target.value})
                    }}
                    autoSize={{minRows: 2, maxRows: 6}}/>
            </Form.Item>

            <Form.Item
                name={"nft-price"}
                label="Price"
                rules={[{required: true, min: 1.0, message: 'Price cannot empty!'}]}>
                <InputNumber
                    onChange={e => {
                        updateFormInput({...formInput, price: e})
                    }}
                    prefix={<FaEthereum/>}
                    style={{width: 300}}
                    min={0}
                    step={0.1}
                    stringMode
                />
            </Form.Item>


            <Form.Item label={"nft-img"}>
                <input
                    type={"file"}
                    name={"nft-img"}
                    onChange={onChange}
                />
                {fileURL && (<img width={"350"} style={{marginTop: 10}} src={fileURL}/>)}
            </Form.Item>


            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" onClick={createNFTSale}>
                    Create NFT
                </Button>
            </Form.Item>
        </Form>
    );
}