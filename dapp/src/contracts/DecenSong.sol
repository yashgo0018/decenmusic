// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @custom:security-contact yashgo0018@gmail.com
contract DecenSong is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using ECDSA for bytes32;

    mapping(uint256 => bool) private usedNonce;
    address private _signer;

    constructor(address _newSigner) ERC721("DecenSong", "DSong") {
        _signer = _newSigner;
    }

    function setSigner(address _newSigner) public onlyOwner {
        _signer = _newSigner;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(
        string memory uri,
        bytes memory _signature,
        uint256 _nonce
    ) public {
        require(!usedNonce[_nonce], "Invalid Nonce");
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, uri, _nonce));
        bytes32 messageHash = hash.toEthSignedMessageHash();
        require(
            messageHash.recover(_signature) == _signer,
            "invalid signature"
        );
        usedNonce[_nonce] = true;
        _safeMint(msg.sender, _nonce);
        _setTokenURI(_nonce, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
