// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Shared/SharedStructs.sol";
import "./Shared/SharedEvents.sol";

contract JohnyMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIDs;

    //Owner of the market contract
    address payable owner;
    //This will be matic thanks to API -> so 0.02 Matic
    uint256 tokenPrice = 0.02 ether;

    //Set owner of the Contract
    constructor() {owner = payable(msg.sender);}

    //Mapper -> from number (index) we get MarketNFT struct
    mapping(uint256 => SharedStructs.MarketNFT) private tokenToMarket;

    /**
     * Get token price
     * @return uint256 token price
     */
    function getTokenPrice() public view returns (uint256){
        return tokenPrice;
    }

    /**
     * Create new NFT object -> deploy to blockchain
     * @param NFTContract - adress of the market contract
     * @param NFTID - ID of the NFT on blockchain for further reference
     * @param price - price of the created NFT
     * nonReentrant makes it safe from reentrance attack
     */
    function createMarketNFT(address NFTContract, uint256 NFTID, uint256 price) public payable nonReentrant {
        //Checks - price is not null and equal to the listed price
        require(price > 0, "Price of the NFT cannot be less than once");
        require(msg.value == tokenPrice, "Inconsistency in NFT price");

        //Increment tokenIDs and get current ID
        tokenIDs.increment();
        uint256 tokenID = tokenIDs.current();

        //Create object of NFT
        tokenToMarket[tokenID] = SharedStructs.MarketNFT(
            tokenID,
            NFTID,
            NFTContract,
            payable(msg.sender),
            payable(msg.sender),
            price,
            false
        );

        //Emit Event that NFT has been deployed to the blockchain
        emit SharedEvents.MarketNFTCreated(tokenID, NFTID, NFTContract, msg.sender, msg.sender, price, false);
    }

    /**
     * Create sale of the NFT on the MarketPlace
     * @param NFTContract - adress of the market contract
     * @param tokenID -internal ID of created token
     * nonReentrant makes it safe from reentrance attack
     */
    function createMarketNFTSale(address NFTContract, uint256 tokenID) public payable nonReentrant {
        uint NFTPrice = tokenToMarket[tokenID].price;
        uint NFTID = tokenToMarket[tokenID].tokenID;
        address tokenOwner = tokenToMarket[tokenID].owner;

        //The price of the NFT has to be met
        require(msg.value == NFTPrice, "Please submit the asking price");


        //Set owner to the new one and increse price
        uint newPrice = (tokenToMarket[tokenID].price * 6) / 5;
        tokenToMarket[tokenID].owner = payable(msg.sender);
        tokenToMarket[tokenID].price = newPrice;
        tokenToMarket[tokenID].sold = true;

        //Transfer token to the new owner -> sender
        IERC721(NFTContract).transferFrom(tokenOwner, msg.sender, NFTID);

        //Transfer money to the owner of the contract
        payable(owner).transfer(tokenPrice);
        //Transfer money to the seller of the token
        payable(tokenOwner).transfer(msg.value);
    }

    /**
     * Fetch all NFTs on the Market Place
     * @return list of NFTs
     */
    function getListedNFTs() public view returns (SharedStructs.MarketNFT[] memory){
        uint NFTCount = tokenIDs.current();
        uint index = 0;

        SharedStructs.MarketNFT[] memory NFTs = new SharedStructs.MarketNFT[](NFTCount);
        for (uint i = 0; i < NFTCount; i++) {
            uint currID = tokenToMarket[i + 1].itemID;
            SharedStructs.MarketNFT storage currentItem = tokenToMarket[currID];
            NFTs[index++] = currentItem;
        }

        return NFTs;
    }

    /**
     * Fetch all NFTs that I (the user) owns
     * @return list of NFTs
     */
    function getUserNFTs() public view returns (SharedStructs.MarketNFT[] memory){
        uint NFTTotalCount = tokenIDs.current();
        uint NFTUserCount = 0;
        uint index = 0;

        //Get count of owned NFTs
        for (uint i = 0; i < NFTTotalCount; i++) {
            if (tokenToMarket[i + 1].owner == msg.sender) {
                NFTUserCount ++;
            }
        }

        //Get all NFTs to array, beacuse we have size of array
        SharedStructs.MarketNFT[] memory NFTs = new SharedStructs.MarketNFT[](NFTUserCount);
        for (uint i = 0; i < NFTTotalCount; i++) {
            if (tokenToMarket[i + 1].owner == msg.sender) {
                uint currID = tokenToMarket[i + 1].itemID;
                SharedStructs.MarketNFT storage currentItem = tokenToMarket[currID];
                NFTs[index++] = currentItem;
            }
        }

        return NFTs;
    }

    /**
     * Fetch all NFTs that I (the user) created
     * @return list of NFTs
     */
    function getCreatedNFTs() public view returns (SharedStructs.MarketNFT[] memory){
        uint NFTTotalCount = tokenIDs.current();
        uint NFTUserCount = 0;
        uint index = 0;

        //Get count of owned NFTs
        for (uint i = 0; i < NFTTotalCount; i++) {
            if (tokenToMarket[i + 1].creator == msg.sender) {
                NFTUserCount ++;
            }
        }

        //Get all NFTs to array, beacuse we have size of array
        SharedStructs.MarketNFT[] memory NFTs = new SharedStructs.MarketNFT[](NFTUserCount);
        for (uint i = 0; i < NFTTotalCount; i++) {
            if (tokenToMarket[i + 1].creator == msg.sender) {
                uint currID = tokenToMarket[i + 1].itemID;
                SharedStructs.MarketNFT storage currentItem = tokenToMarket[currID];
                NFTs[index++] = currentItem;
            }
        }

        return NFTs;
    }


}