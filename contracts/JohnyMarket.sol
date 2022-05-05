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
    address payable constant owner2 = payable(0xCaC55624d32eb1B479CbDE2ef3B7dec9b9Cf8459);

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

    function getPrice(uint256 nftPrice) public view returns (uint256){
        uint256 finalPrice = nftPrice + (contractFee * 2);
        return finalPrice;
    }

    /**
     * Create new NFT object -> deploy to blockchain
     * @param NFTContract - adress of the market contract
     * @param NFTID - ID of the NFT on blockchain for further reference
     * @param price - price of the created NFT
     * nonReentrant makes it safe from reentrance attack
     */
    function createMarketNFT(address NFTContract, uint256 NFTID, uint256 price) public payable nonReentrant {
        require(price > 0, "Price of the NFT cannot be less than once");
        require(msg.value == contractFee, "Inconsistency in Fee price");

        tokenIDs.increment();
        uint256 tokenID = tokenIDs.current();

        tokenToMarket[tokenID] = SharedStructs.MarketNFT(
            tokenID,
            NFTID,
            NFTContract,
            payable(msg.sender),
            payable(msg.sender),
            price,
            false);

        IERC721(NFTContract).transferFrom(msg.sender, address(this), tokenID);
        payable(owner).call{value : contractFee}("");
        emit SharedEvents.MarketNFTCreated(tokenID, NFTID, NFTContract, msg.sender, msg.sender, price, false);
    }

    /**
     * Create sale of the NFT on the MarketPlace
     * @param tokenID - internal ID of created token
     * nonReentrant makes it safe from reentrance attack
     */
    function createMarketNFTSale(uint256 tokenID) public payable nonReentrant {
        uint NFTPrice = tokenToMarket[tokenID].price;
        uint256 fprice = getPrice(NFTPrice);

        require(msg.value == fprice, "Please submit the asking price");
        require(tokenToMarket[tokenID].owner != msg.sender, "Buyer cannot buy his own token");

        //Pay PRICE to the owner of NFT
        tokenToMarket[tokenID].owner.call{value : (msg.value - (contractFee * 2))}("");
        //Pay FEE to the creator of NFT
        tokenToMarket[tokenID].creator.call{value : contractFee}("");
        //Pay FEE to owner of the contract
        payable(owner).call{value : contractFee / 2}("");
        payable(owner2).call{value : contractFee / 2}("");

        //Set owner to the new one -> new token price = 1.2 times bigger
        tokenToMarket[tokenID].owner = payable(msg.sender);
        tokenToMarket[tokenID].price = (NFTPrice * 6) / 5;
        tokenToMarket[tokenID].sold = true;
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