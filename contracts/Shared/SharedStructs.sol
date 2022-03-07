// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library SharedStructs{
    //Structure for offered NFTs on web app
    struct MarketNFT{
        //ID for internal purpose -> WebApp
        uint itemID;
        //ID of the this NFT
        uint256 tokenID;
        //Address of the contract that deployed the NFT
        address tokenContract;
        //Who is selling it
        address payable seller;
        //Who owns it
        address payable owner;
        //Price in ether -> later matic
        uint256 price;
        //If NFT is sold
        bool sold;
    }
}