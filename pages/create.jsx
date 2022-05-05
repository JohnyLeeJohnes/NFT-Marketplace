import React, {useState} from "react";
import {create as ipfsHttpClient} from "ipfs-http-client";
import {useRouter} from "next/router";
import {ethers} from "ethers";
import Token from "../artifacts/contracts/Token.sol/Token.json"
import JohnyMarket from "../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json"
import Web3Modal from "web3modal";
import {Button, Col, Form, Image, Input, InputNumber, message, Row, Typography, Upload} from 'antd';
import 'antd/dist/antd.css';
import {useContractAddressContext, useMenuSelectionContext, useSpinnerContext} from "../components";
import {InboxOutlined} from "@ant-design/icons";
import {useTranslation} from "../utils/use-translations";
import matic from "../public/matic.svg"
import Picture from "next/image";

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const {Dragger} = Upload;

export default function CreatePage() {
    const [fileURL, setFileURL] = useState(null)
    const contractAddress = useContractAddressContext()
    const globalSpinner = useSpinnerContext()
    const router = useRouter()
    const {t} = useTranslation()
    const getFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    useMenuSelectionContext().useSelection(["/create"])
    useSpinnerContext().useSpinning(false)

    //Upload uploaded file to IPFS
    async function onChange(e) {
        globalSpinner.setSpinning(true)
        if (e.fileList && e.fileList.length > 0) {
            try {
                const img = e.fileList[0].originFileObj
                const addedImage = await client.add(img)
                const imageURL = `https://ipfs.infura.io/ipfs/${addedImage.path}`
                setFileURL(imageURL)
                message.success(`${e.fileList[0].originFileObj.name} was uploaded successfully!`)
            } catch (error) {
                message.error('Error uploading file')
                console.log(error)
            }
        }
        globalSpinner.setSpinning(false)
    }

    //Upload form data to IPFS
    async function uploadToIPSF(values) {
        //Get -> Stringify form data
        const name = values["nft-name"]
        const author = values["nft-author"] ? values["nft-author"] : "Anonym"
        const description = values["nft-description"]
        const data = JSON.stringify({
            name, author, description, image: fileURL
        })

        //Get file from IPFS URL -> create sale
        try {
            const addedFile = await client.add(data)
            return `https://ipfs.infura.io/ipfs/${addedFile.path}`;
        } catch (e) {
            globalSpinner.setSpinning(false)
            console.log(e)
        }
    }

    //Upload NFT to market contract
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
            let tokenContract = new ethers.Contract(contractAddress.tokenAddress, Token.abi, w3mSigner)
            let transaction = await tokenContract.mintToken(ipfsUrl)
            let transactionOutput = await transaction.wait()
            let tokenID = ((transactionOutput.events[0]).args[2]).toNumber()

            //Get listed price from Form
            const price = ethers.utils.parseUnits(values["nft-price"], 'ether')

            //Connect to market contract -> get default token price
            let marketContract = new ethers.Contract(contractAddress.marketAddress, JohnyMarket.abi, w3mSigner)
            let contractFee = await marketContract.getContractFee()
            contractFee = contractFee.toString()

            //Deploy NFT to Market
            transaction = await marketContract.createMarketNFT(
                contractAddress.tokenAddress, tokenID, price, {value: contractFee}
            )

            //Reroute back to dashboard
            await transaction.wait()
            await router.push('/market')
        } catch (e) {
            console.log(e)
        } finally {
            globalSpinner.setSpinning(false)
        }
    }

    //Validate form items
    async function validateForm(values) {
        return !(!values["nft-name"] || !values["nft-description"] || !values["nft-price"]);
    }

    return (
        <div>
            <Row justify="center">
                <Col span={8}>
                    <Typography.Title level={3} style={{marginBottom: 20}}>
                        {t("Create and Sell your NFT")}
                    </Typography.Title>
                </Col>
            </Row>

            <Form
                name={"basic"}
                labelCol={{span: 8}}
                wrapperCol={{span: 10}}
                autoComplete={"off"}
                onFinish={async values => {
                    const validation = await validateForm(values)
                    if (validation) {
                        globalSpinner.setSpinning(true)
                        await createNFTSale(values)
                    } else {
                        message.error("Some fields are missing!");
                    }
                }}
            >
                <Form.Item
                    name={"nft-name"}
                    label={t("Name")}
                    rules={[{required: true, message: 'NFT Name cannot be empty'}]}
                >
                    <Input maxLength={25}/>
                </Form.Item>

                <Form.Item
                    name={"nft-author"}
                    label={t("Author")}
                >
                    <Input maxLength={25}/>
                </Form.Item>

                <Form.Item
                    name={"nft-description"}
                    label={t("Description")}
                    rules={[{required: true, message: 'NFT Description cannot be empty!'}]}
                >
                    <Input.TextArea maxLength={150} autoSize={{minRows: 2, maxRows: 6}}/>
                </Form.Item>

                <Form.Item
                    name={"nft-price"}
                    label={t("Price")}
                    rules={[{required: true, min: 0.01, message: 'Price cannot be empty!'}]}
                >
                    <InputNumber
                        prefix={<Picture width={15} height={15} src={matic} alt={"MATIC"}/>}
                        style={{width: 250, maxWidth: 250}}
                        max={10}
                        min={0.01}
                        step={0.01}
                        stringMode
                    />
                </Form.Item>


                <Form.Item
                    name={'nft-image'}
                    label={t("NFT Image")}
                    getValueFromEvent={getFile}
                    rules={[{required: true, message: 'You have to upload image to create NFT!'}]}
                >
                    <Dragger
                        listType={"text"}
                        maxCount={1}
                        beforeUpload={() => false}
                        onChange={onChange}
                        onPreview={() => false}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">{t("Click or drag file to this area to upload")}</p>
                    </Dragger>
                </Form.Item>

                {fileURL && (
                    <Form.Item label={t("Image preview")}>
                        <Image width={"350"} src={fileURL} alt={"nft-image"}/>
                    </Form.Item>
                )}

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        {t("Create NFT")}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}