// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library SharedEvents {
    //Event when NFT is created -> same as MarketNFT struct
    event MarketNFTCreated (
        uint indexed itemID,
        uint256 indexed tokenID,
        address indexed tokenContract,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );
}