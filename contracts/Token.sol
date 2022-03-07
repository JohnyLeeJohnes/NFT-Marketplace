// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//Inheriting from library ERC721URIStorage.sol
contract Token is ERC721URIStorage {
    string public TOKEN_NAME = "Johny Token";
    string public TOKEN_SYMBOL = "JT";

    //Import counters -> ERC721 documentation
    using Counters for Counters.Counter;
    Counters.Counter private nftIDs;
    address contractAddress;

    //Overlaod constructor -> name tokens and their symbol
    constructor (address marketAddress) ERC721(TOKEN_NAME, TOKEN_SYMBOL){
        contractAddress = marketAddress;
    }

    //Main contract logic for creating NFTs from Image
    function mintToken(string memory tokenURI) public returns (uint){
        //Incement IDs -> get ID
        nftIDs.increment();
        uint256 newTokenID = nftIDs.current();

        //Mint new token -> set image URI -> sent for approval to blockchain
        _mint(msg.sender, newTokenID);
        _setTokenURI(newTokenID, tokenURI);
        setApprovalForAll(contractAddress, true);

        //Return minted token ID
        return newTokenID;
    }

}
