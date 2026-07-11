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
        Refunded,
        Expired
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

    // Event schema version: v1 (Phase 2B event architecture)
    event ListingCreated(
        bytes32 indexed listingId,
        address indexed seller,
        bytes32 indexed passportId,
        uint256 unitPrice,
        uint256 quantity,
        uint256 createdAt
    );
    event ListingUpdated(
        bytes32 indexed listingId,
        address indexed seller,
        bytes32 indexed fieldMask,
        uint256 unitPrice,
        uint256 totalQuantity,
        uint256 availableQuantity,
        uint256 updatedAt
    );
    event ListingQuantityAdjusted(
        bytes32 indexed listingId,
        uint256 previousQuantity,
        uint256 newQuantity,
        bytes32 indexed reasonCode,
        address indexed updatedBy,
        uint256 updatedAt
    );
    event ListingStatusChanged(
        bytes32 indexed listingId,
        ListingStatus previousStatus,
        ListingStatus newStatus,
        address indexed changedBy,
        uint256 changedAt
    );
    event ListingCancelled(
        bytes32 indexed listingId,
        address indexed seller,
        bytes32 indexed reasonCode,
        uint256 cancelledAt
    );
    event OfferPlaced(
        bytes32 indexed offerId,
        bytes32 indexed listingId,
        address indexed buyer,
        uint256 quantity,
        uint256 totalPrice,
        uint256 placedAt
    );
    event OfferUpdated(
        bytes32 indexed offerId,
        bytes32 indexed listingId,
        address indexed buyer,
        bytes32 fieldMask,
        uint256 quantity,
        uint256 totalPrice,
        uint256 updatedAt
    );
    event OfferAccepted(
        bytes32 indexed offerId,
        bytes32 indexed listingId,
        address indexed seller,
        address buyer,
        uint256 totalPrice,
        uint256 acceptedAt
    );
    event OfferRejected(
        bytes32 indexed offerId,
        bytes32 indexed listingId,
        address indexed seller,
        bytes32 reasonCode,
        uint256 rejectedAt
    );
    event OfferExpired(
        bytes32 indexed offerId,
        bytes32 indexed listingId,
        address indexed expiredBy,
        uint256 expiredAt
    );
    event OfferRefunded(
        bytes32 indexed offerId,
        bytes32 indexed listingId,
        address indexed buyer,
        uint256 amount,
        uint256 refundedAt
    );

    error ListingAlreadyExists(bytes32 listingId);
    error ListingNotOpen(bytes32 listingId);
    error ListingNotFound(bytes32 listingId);
    error OfferAlreadyExists(bytes32 offerId);
    error OfferNotPending(bytes32 offerId);
    error OfferNotFound(bytes32 offerId);
    error Unauthorized();
    error InvalidQuantity();
    error IncorrectPayment();
    error InvalidStatusTransition();

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

        emit ListingCreated(listingId, msg.sender, passportId, unitPrice, quantity, block.timestamp);
        emit ListingStatusChanged(listingId, ListingStatus.Open, ListingStatus.Open, msg.sender, block.timestamp);
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

        emit OfferPlaced(offerId, listingId, msg.sender, quantity, totalPrice, block.timestamp);
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
            ListingStatus previousStatus = listing.status;
            listing.status = ListingStatus.Closed;
            emit ListingStatusChanged(offer.listingId, previousStatus, ListingStatus.Closed, msg.sender, block.timestamp);
        }

        (bool sent, ) = listing.seller.call{value: offer.totalPrice}("");
        require(sent, "Transfer failed");

        emit OfferAccepted(offerId, offer.listingId, listing.seller, offer.buyer, offer.totalPrice, block.timestamp);
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

        ListingStatus previousStatus = listing.status;
        listing.status = ListingStatus.Cancelled;
        emit ListingStatusChanged(listingId, previousStatus, ListingStatus.Cancelled, msg.sender, block.timestamp);
        emit ListingCancelled(listingId, msg.sender, bytes32("seller_cancelled"), block.timestamp);
    }

    function updateListing(bytes32 listingId, uint256 unitPrice, bytes32 fieldMask) external {
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

        listing.unitPrice = unitPrice;
        emit ListingUpdated(
            listingId,
            msg.sender,
            fieldMask,
            listing.unitPrice,
            listing.totalQuantity,
            listing.availableQuantity,
            block.timestamp
        );
    }

    function adjustListingQuantity(bytes32 listingId, uint256 newTotalQuantity, bytes32 reasonCode) external {
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

        uint256 soldQuantity = listing.totalQuantity - listing.availableQuantity;
        if (newTotalQuantity == 0 || newTotalQuantity < soldQuantity) {
            revert InvalidQuantity();
        }

        uint256 previousQuantity = listing.totalQuantity;
        listing.totalQuantity = newTotalQuantity;
        listing.availableQuantity = newTotalQuantity - soldQuantity;

        emit ListingQuantityAdjusted(
            listingId,
            previousQuantity,
            newTotalQuantity,
            reasonCode,
            msg.sender,
            block.timestamp
        );
        emit ListingUpdated(
            listingId,
            msg.sender,
            bytes32("total_quantity"),
            listing.unitPrice,
            listing.totalQuantity,
            listing.availableQuantity,
            block.timestamp
        );
    }

    function setListingStatus(bytes32 listingId, ListingStatus newStatus, bytes32 reasonCode) external {
        Listing storage listing = listings[listingId];
        if (listing.seller == address(0)) {
            revert ListingNotFound(listingId);
        }
        if (msg.sender != listing.seller) {
            revert Unauthorized();
        }
        if (listing.status == newStatus) {
            revert InvalidStatusTransition();
        }

        ListingStatus previousStatus = listing.status;
        listing.status = newStatus;
        emit ListingStatusChanged(listingId, previousStatus, newStatus, msg.sender, block.timestamp);

        if (newStatus == ListingStatus.Cancelled) {
            emit ListingCancelled(listingId, msg.sender, reasonCode, block.timestamp);
        }
    }

    function updateOffer(bytes32 offerId, uint256 newQuantity, bytes32 fieldMask) external payable {
        Offer storage offer = offers[offerId];
        if (offer.buyer == address(0)) {
            revert OfferNotFound(offerId);
        }
        if (offer.status != OfferStatus.Pending) {
            revert OfferNotPending(offerId);
        }
        if (msg.sender != offer.buyer) {
            revert Unauthorized();
        }

        Listing storage listing = listings[offer.listingId];
        if (listing.seller == address(0)) {
            revert ListingNotFound(offer.listingId);
        }
        if (listing.status != ListingStatus.Open) {
            revert ListingNotOpen(offer.listingId);
        }
        if (newQuantity == 0 || newQuantity > listing.availableQuantity) {
            revert InvalidQuantity();
        }

        uint256 newTotalPrice = listing.unitPrice * newQuantity;
        if (newTotalPrice > offer.totalPrice) {
            uint256 additionalPayment = newTotalPrice - offer.totalPrice;
            if (msg.value != additionalPayment) {
                revert IncorrectPayment();
            }
        } else if (newTotalPrice < offer.totalPrice) {
            if (msg.value != 0) {
                revert IncorrectPayment();
            }
            uint256 refundAmount = offer.totalPrice - newTotalPrice;
            (bool refundSent, ) = offer.buyer.call{value: refundAmount}("");
            require(refundSent, "Transfer failed");
            emit OfferRefunded(offerId, offer.listingId, offer.buyer, refundAmount, block.timestamp);
        } else if (msg.value != 0) {
            revert IncorrectPayment();
        }

        offer.quantity = newQuantity;
        offer.totalPrice = newTotalPrice;
        emit OfferUpdated(offerId, offer.listingId, offer.buyer, fieldMask, newQuantity, newTotalPrice, block.timestamp);
    }

    function rejectOffer(bytes32 offerId, bytes32 reasonCode) external {
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

        offer.status = OfferStatus.Rejected;
        emit OfferRejected(offerId, offer.listingId, msg.sender, reasonCode, block.timestamp);

        (bool refundSent, ) = offer.buyer.call{value: offer.totalPrice}("");
        require(refundSent, "Transfer failed");
        emit OfferRefunded(offerId, offer.listingId, offer.buyer, offer.totalPrice, block.timestamp);
    }

    function expireOffer(bytes32 offerId) external {
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

        offer.status = OfferStatus.Expired;
        emit OfferExpired(offerId, offer.listingId, msg.sender, block.timestamp);

        (bool refundSent, ) = offer.buyer.call{value: offer.totalPrice}("");
        require(refundSent, "Transfer failed");
        emit OfferRefunded(offerId, offer.listingId, offer.buyer, offer.totalPrice, block.timestamp);
    }
}
