import React, {useState} from "react";
import {create as ipfsHttpClient} from "ipfs-http-client";
import {useRouter} from "next/router";
import {ethers} from "ethers";
import Token from "../artifacts/contracts/Token.sol/Token.json"
import JohnyMarket from "../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json"
import Web3Modal from "web3modal";
import {marketAddress, tokenAddress} from "../config";
import {Button, Form, Input, InputNumber, message, Upload} from 'antd';
import 'antd/dist/antd.css';
import {useTranslation} from "../utils/use-translations";
import {FaEthereum} from 'react-icons/fa';
import {useMenuSelectionContext} from "../components";

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const {Dragger} = Upload;

export default function Create() {
    useMenuSelectionContext().useSelection(["/create"])
    const [fileURL, setFileURL] = useState(null)
    //const [formInput, updateFormInput] = useState({price: "", name: "", description: ""})
    const router = useRouter()
    const {t} = useTranslation()
    const getFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    //Upload uploaded file to IPFS
    async function onChange(e) {
        try {
            const img = e.fileList[0].originFileObj
            const addedImage = await client.add(img)
            const imageURL = `https://ipfs.infura.io/ipfs/${addedImage.path}`
            setFileURL(imageURL)
            message.success(`File ${e.name} was uploaded successfully!`)
            console.log(imageURL)
        } catch (error) {
            message.error('Error uploading file')
            console.log(error)
        }
    }

    //Upload form data to IPFS
    async function uploadToIPSF(values) {

        //Get -> Stringify form data
        const name = values["nft-name"]
        const description = values["nft-description"]
        const data = JSON.stringify({
            name, description, image: fileURL
        })

        //Get file from IPFS URL -> create sale
        try {
            const addedFile = await client.add(data)
            return `https://ipfs.infura.io/ipfs/${addedFile.path}`;
        } catch (e) {
            console.log(e)
        }
    }

    async function createNFTSale(values) {
        //Get uploaded file URl
        try {
            //Get IPFS url
            const ipfsUrl = await uploadToIPSF(values)

            //Connect to Web3Modal -> get signer
            const w3m = new Web3Modal()
            const w3mConnection = await w3m.connect()
            const w3mProvider = new ethers.providers.Web3Provider(w3mConnection)
            const w3mSigner = w3mProvider.getSigner()

            //Connect to token contract -> mint new token from the URL -> get the token
            let tokenContract = new ethers.Contract(tokenAddress, Token.abi, w3mSigner)
            let transaction = await tokenContract.mintToken(ipfsUrl)
            let transactionOutput = await transaction.wait()
            let tokenID = ((transactionOutput.events[0]).args[2]).toNumber()

            //Get listed price from Form
            const price = ethers.utils.parseUnits(values["nft-price"], 'ether')

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


    async function validateForm(values) {
        return !(!values["nft-name"] || !values["nft-description"] || !values["nft-price"]);
    }

    return (
        <Form
            name="basic"
            labelCol={{span: 8}}
            wrapperCol={{span: 10}}
            autoComplete={"off"}
            onFinish={async values => {
                const validation = await validateForm(values)
                if (validation) {
                    await createNFTSale(values)
                } else {
                    message.error("Some fields are missing!");
                }
            }}
        >
            <Form.Item
                name={"nft-name"}
                label={t("Name")}
                rules={[{required: true, message: 'Please input NFT name!'}]}>
                <Input/>
            </Form.Item>

            <Form.Item
                name={"nft-description"}
                label={t("Description")}
                rules={[{required: true, message: 'Please insert description of NFT!'}]}
            >
                <Input.TextArea autoSize={{minRows: 2, maxRows: 6}}/>
            </Form.Item>

            <Form.Item
                name={"nft-price"}
                label={"Price"}
                rules={[{required: true, min: 1, message: 'Price cannot empty!'}]}
            >
                <InputNumber
                    prefix={<FaEthereum/>}
                    style={{width: 300}}
                    min={1}
                    step={0.1}
                    stringMode
                />
            </Form.Item>


            <Form.Item
                name={'nft-image'}
                label={"NFT Image"}
                getValueFromEvent={getFile}
            >
                <Dragger
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false}
                    onChange={onChange}
                >
                    Upload
                </Dragger>
            </Form.Item>


            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit">
                    Create NFT
                </Button>
            </Form.Item>
        </Form>
    );
}