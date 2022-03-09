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
    Counters.Counter private tokenSold;

    //Owner of the market contract
    address payable owner;
    //This will be matic thanks to API -> so 0.01 Matic
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
        //Price checks
        require(price > 0, "Price of the NFT cannot be less than once");
        require(msg.value == tokenPrice, "Inconsistenci in NFT price");

        //Increment tokenIDs and get current ID
        tokenIDs.increment();
        uint256 tokenID = tokenIDs.current();

        //Create object -> add to mapper - Seller is the sender and owner is empty beacuse its created
        tokenToMarket[tokenID] = SharedStructs.MarketNFT(
            tokenID,
            NFTID,
            NFTContract,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        //Take the NFT and transfer it ot the owner(this address) from seller
        IERC721(NFTContract).transferFrom(msg.sender, address(this), tokenID);

        //Emit Event that NFT has been deployed to the blockchain
        emit SharedEvents.MarketNFTCreated(tokenID, NFTID, NFTContract, msg.sender, address(0), price, false);
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

        //The price of the NFT has to be met
        require(msg.value == NFTPrice, "Please submit the asking price");

        //Transfer money to the sellers account
        tokenToMarket[tokenID].seller.transfer(msg.value);

        //Transfer token to the buyers collection
        IERC721(NFTContract).transferFrom(address(this), msg.sender, NFTID);

        //Set the owner of the NFT -> increment number of sold tokens
        tokenToMarket[tokenID].owner = payable(msg.sender);
        tokenToMarket[tokenID].sold = true;
        tokenSold.increment();

        //Pay the owner of the contract Fee
        payable(owner).transfer(tokenPrice);
    }

    /**
     * Fetch all NFTs on the Market Place
     * @return list of NFTs
     */
    function getListedNFTs() public view returns (SharedStructs.MarketNFT[] memory){
        uint NFTCount = tokenIDs.current();
        uint unsoldNFTCount = tokenIDs.current() - tokenSold.current();
        uint index = 0;

        SharedStructs.MarketNFT[] memory NFTs = new SharedStructs.MarketNFT[](unsoldNFTCount);
        for (uint i = 0; i < NFTCount; i++) {
            if (tokenToMarket[i + 1].owner == address(this)) {
                //If NFT has empty owner -> is on sale on market
                uint currID = tokenToMarket[i + 1].itemID;
                SharedStructs.MarketNFT storage currentItem = tokenToMarket[currID];
                NFTs[index] = currentItem;
                index += 1;
            }
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
            if (tokenToMarket[i + 1].seller == msg.sender) {
                NFTUserCount ++;
            }
        }

        //Get all NFTs to array, beacuse we have size of array
        SharedStructs.MarketNFT[] memory NFTs = new SharedStructs.MarketNFT[](NFTUserCount);
        for (uint i = 0; i < NFTTotalCount; i++) {
            if (tokenToMarket[i + 1].seller == msg.sender) {
                uint currID = tokenToMarket[i + 1].itemID;
                SharedStructs.MarketNFT storage currentItem = tokenToMarket[currID];
                NFTs[index++] = currentItem;
            }
        }

        return NFTs;
    }


}