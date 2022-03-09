import {useState} from "react";
import {create as ihttpc} from "ipfs-http-client";
import {useRouter} from "next/router";
import {ethers} from "ethers";
import Token from "../artifacts/contracts/Token.sol/Token.json"
import JohnyMarket from "../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json"
import Web3Modal from "web3modal";
import {marketAddress, tokenAddress} from "../config";
import {Button, Form, Input, InputNumber, Upload, message } from 'antd';
import 'antd/dist/antd.css';
import {useTranslation} from "../utils/use-translations";
import {InboxOutlined} from "@ant-design/icons";

const {Dragger} = Upload;

const client = ihttpc("https://ipfs.infura.io:5001/api/v0")

export default function Create() {
    const [fileURL, setFileURL] = useState(null)
    const [formInput, updateFormInput] = useState({price: "", name: "", description: ""})
    const router = useRouter()

    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const addedFile = await client.add(file, {
                progress: (p) => console.log(`recieved: ${p}`)
            })
            const ipfsFileUrl = `https://ipfs.infura.io:5001/ipfs/${addedFile.path}`
            setFileURL(ipfsFileUrl)
        } catch (e) {
            console.log(e)
        }
    }

    async function createNFT() {
        //Validate form data
        const {name, descrtiption, price} = formInput
        if (!name || !descrtiption || !price || !fileURL) return

        //Stringify data from JSON
        const data = JSON.stringify({
            name, descrtiption, image: fileURL
        })

        //Get file from IPFS URL -> create sale
        try {
            const addedFile = await client.add(data)
            const ipfsFileUrl = `https://ipfs.infura.io:5001/ipfs/${addedFile.path}`
            await createNFTSale(ipfsFileUrl)
        } catch (e) {
            console.log(e)
        }
    }

    async function createNFTSale(ipfsFileUrl) {
        //Connect to W3Modal and get signer of the contract
        const w3mConnection = new Web3Modal().connect()
        const signer = new ethers.providers.Web3Provider(w3mConnection).getSigner()

        //Connect to token contract -> mind new token from the URL
        let tokenContract = new ethers.Contract(tokenAddress, Token.abi, signer)
        let transaction = await tokenContract.mintToken(ipfsFileUrl)
        let transactionOutput = await transaction.wait()

        //Get token & price from the transaction
        let tokenID = transactionOutput.event[0].args[2].toNumber()
        const price = ethers.utils.parseUnits(formInput.price, 'ether')

        //Connect to market contract -> get default token price
        let marketContract = new ethers.Contract(marketAddress, JohnyMarket.abi, signer)
        let tokenPrice = await marketContract.getTokenPrice()
        tokenPrice = tokenPrice.toString()

        //Deploy NFT to Market
        transaction = await marketContract.createMarketNFT(
            tokenAddress, tokenID, price, {value: tokenPrice}
        )

        //Reroute back to dashboard
        await transaction.wait()
        await router.push('/')
    }

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const {t} = useTranslation()

    return (
        <Form
            name="basic"
            labelCol={{span: 8}}
            wrapperCol={{span: 10}}
            initialValues={{remember: true}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete={"off"}>
            <Form.Item
                name={"nft-name"}
                label={t("Name")}
                rules={[{required: true, message: 'Please input NFT name!'}]}>
                <Input/>
            </Form.Item>

            <Form.Item
                name={"nft-description"}
                label={t("Description")}
                rules={[{required: true, message: 'Please insert description of NFT!'}]}>
                <Input.TextArea
                    autoSize={{minRows: 2, maxRows: 6}}/>
            </Form.Item>

            <Form.Item
                name={"nft-price"}
                label="Price"
                rules={[{required: true, min: 1.0, message: 'Price cannot empty!'}]}>
                <InputNumber
                    style={{width: 300}}
                    min={0}
                    step={0.1}
                    stringMode
                />
            </Form.Item>

            <Form.Item
                name={"nft-image"}
                label={t("Image")}>
                <Dragger
                    name={"file"}
                    multiple={false}
                    onChange={ (info) => {
                        const { status } = info.file;
                        if (status !== 'uploading') {
                            console.log(info.file, info.fileList);
                        }
                        if (status === 'done') {
                            message.success(`${info.file.name} file uploaded successfully.`);

                        } else if (status === 'error') {
                            message.error(`${info.file.name} file upload failed.`);
                        }

                    }}
                    onDrop={ (e) => {
                        console.log('Dropped files', e.dataTransfer.files);
                    }}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined/>
                    </p>

                </Dragger>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
        ;
}