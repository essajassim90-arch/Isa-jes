// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Marketplace {
    enum ListingStatus {
        Open,
        Closed,
        Cancelled
    }

    enum OfferStatus {
        Pending,
        Accepted,
        Rejected,
        Refunded
    }

    struct Listing {
        address seller;
        bytes32 passportId;
        uint256 unitPrice;
        uint256 totalQuantity;
        uint256 availableQuantity;
        ListingStatus status;
    }

    struct Offer {
        address buyer;
        bytes32 listingId;
        uint256 quantity;
        uint256 totalPrice;
        OfferStatus status;
    }

    mapping(bytes32 => Listing) public listings;
    mapping(bytes32 => Offer) public offers;

    event ListingCreated(
        bytes32 indexed listingId,
        address indexed seller,
        bytes32 indexed passportId,
        uint256 unitPrice,
        uint256 quantity
    );
    event ListingCancelled(bytes32 indexed listingId);
    event OfferPlaced(bytes32 indexed offerId, bytes32 indexed listingId, address indexed buyer, uint256 quantity, uint256 totalPrice);
    event OfferAccepted(bytes32 indexed offerId, bytes32 indexed listingId, address indexed seller, address buyer, uint256 totalPrice);

    error ListingAlreadyExists(bytes32 listingId);
    error ListingNotOpen(bytes32 listingId);
    error ListingNotFound(bytes32 listingId);
    error OfferAlreadyExists(bytes32 offerId);
    error OfferNotPending(bytes32 offerId);
    error OfferNotFound(bytes32 offerId);
    error Unauthorized();
    error InvalidQuantity();
    error IncorrectPayment();

    function createListing(
        bytes32 listingId,
        bytes32 passportId,
        uint256 unitPrice,
        uint256 quantity
    ) external {
        if (listings[listingId].seller != address(0)) {
            revert ListingAlreadyExists(listingId);
        }
        if (quantity == 0) {
            revert InvalidQuantity();
        }

        listings[listingId] = Listing({
            seller: msg.sender,
            passportId: passportId,
            unitPrice: unitPrice,
            totalQuantity: quantity,
            availableQuantity: quantity,
            status: ListingStatus.Open
        });

        emit ListingCreated(listingId, msg.sender, passportId, unitPrice, quantity);
    }

    function placeOffer(bytes32 offerId, bytes32 listingId, uint256 quantity) external payable {
        Listing storage listing = listings[listingId];
        if (listing.seller == address(0)) {
            revert ListingNotFound(listingId);
        }
        if (listing.status != ListingStatus.Open) {
            revert ListingNotOpen(listingId);
        }
        if (offers[offerId].buyer != address(0)) {
            revert OfferAlreadyExists(offerId);
        }
        if (quantity == 0 || quantity > listing.availableQuantity) {
            revert InvalidQuantity();
        }

        uint256 totalPrice = listing.unitPrice * quantity;
        if (msg.value != totalPrice) {
            revert IncorrectPayment();
        }

        offers[offerId] = Offer({
            buyer: msg.sender,
            listingId: listingId,
            quantity: quantity,
            totalPrice: totalPrice,
            status: OfferStatus.Pending
        });

        emit OfferPlaced(offerId, listingId, msg.sender, quantity, totalPrice);
    }

    function acceptOffer(bytes32 offerId) external {
        Offer storage offer = offers[offerId];
        if (offer.buyer == address(0)) {
            revert OfferNotFound(offerId);
        }
        if (offer.status != OfferStatus.Pending) {
            revert OfferNotPending(offerId);
        }

        Listing storage listing = listings[offer.listingId];
        if (listing.seller == address(0)) {
            revert ListingNotFound(offer.listingId);
        }
        if (msg.sender != listing.seller) {
            revert Unauthorized();
        }

        offer.status = OfferStatus.Accepted;
        listing.availableQuantity -= offer.quantity;
        if (listing.availableQuantity == 0) {
            listing.status = ListingStatus.Closed;
        }

        (bool sent, ) = listing.seller.call{value: offer.totalPrice}("");
        require(sent, "Transfer failed");

        emit OfferAccepted(offerId, offer.listingId, listing.seller, offer.buyer, offer.totalPrice);
    }

    function cancelListing(bytes32 listingId) external {
        Listing storage listing = listings[listingId];
        if (listing.seller == address(0)) {
            revert ListingNotFound(listingId);
        }
        if (listing.status != ListingStatus.Open) {
            revert ListingNotOpen(listingId);
        }
        if (msg.sender != listing.seller) {
            revert Unauthorized();
        }

        listing.status = ListingStatus.Cancelled;
        emit ListingCancelled(listingId);
    }
}
