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
    //This will be MATIC thanks to API -> so 0.05 Matic
    uint256 contractFee = 0.05 ether;

    //Set owner of the Contract
    constructor() {owner = payable(msg.sender);}

    //Mapper -> from number (index) we get MarketNFT struct
    mapping(uint256 => SharedStructs.MarketNFT) private tokenToMarket;

    /**
     * Get token price
     * @return uint256 token price
     */
    function getContractFee() public view returns (uint256){
        return contractFee;
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
        require(msg.value == contractFee, "Inconsistency in Fee price");

        //Increment tokenIDs and get current ID
        tokenIDs.increment();
        uint256 tokenID = tokenIDs.current();

        //Create object of NFT
        tokenToMarket[tokenID] = SharedStructs.MarketNFT(tokenID, NFTID, NFTContract, payable(msg.sender), payable(msg.sender), price, false);

        //Take the NFT and transfer it ot the owner(this address) from seller
        IERC721(NFTContract).transferFrom(msg.sender, address(this), tokenID);

        //Emit Event that NFT has been deployed to the blockchain
        emit SharedEvents.MarketNFTCreated(tokenID, NFTID, NFTContract, msg.sender, msg.sender, price, false);
    }

    /**
     * Create sale of the NFT on the MarketPlace
     * @param tokenID - internal ID of created token
     * nonReentrant makes it safe from reentrance attack
     */
    function createMarketNFTSale(uint256 tokenID) public payable nonReentrant {
        uint NFTPrice = tokenToMarket[tokenID].price;

        //The price of the NFT has to be met
        require(msg.value == NFTPrice, "Please submit the asking price");
        require(tokenToMarket[tokenID].owner != msg.sender, "Buyer cannot buy his own token");

        //Transfer price -> NFT owner
        tokenToMarket[tokenID].owner.transfer(msg.value);
        //Transfer fee -> NFT creator
        if (tokenToMarket[tokenID].owner != tokenToMarket[tokenID].creator) {
            tokenToMarket[tokenID].creator.transfer(contractFee);
        }

        //Set owner to the new one -> new token price = 1.2 times bigger
        tokenToMarket[tokenID].owner = payable(msg.sender);
        tokenToMarket[tokenID].price = (NFTPrice * 6) / 5;
        tokenToMarket[tokenID].sold = true;

        //Pay the owner of the contract Fee
        payable(owner).transfer(contractFee);

        //Pay for the token to the owner
        /*payable(tokenOwner).transfer(msg.value);
        //Transfer fee to the NFT creator -> if not the same person
        if (tokenOwner != tokenCreator) {
            payable(tokenCreator).transfer(contractFee);
        }*/
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