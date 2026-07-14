// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DPP {
    struct Passport {
        string batchId;
        string product;
        string origin;
        string metadataHash;
        address owner;
        bool active;
        uint256 createdAt;
    }

    mapping(bytes32 => Passport) private passports;

    // Event schema version: v1 (Phase 2B event architecture)
    event PassportCreated(
        bytes32 indexed passportId,
        string indexed batchId,
        address indexed owner,
        string product,
        string origin,
        uint256 createdAt
    );
    event PassportStatusUpdated(
        bytes32 indexed passportId,
        address indexed updatedBy,
        bool previousActive,
        bool active,
        uint256 updatedAt
    );
    event PassportMetadataUpdated(
        bytes32 indexed passportId,
        bytes32 indexed fieldMask,
        address indexed updatedBy,
        string metadataHash,
        uint256 updatedAt
    );
    event PassportCertificationAttached(
        bytes32 indexed passportId,
        bytes32 indexed certType,
        address indexed issuer,
        string certificationHash,
        uint256 issuedAt,
        uint256 expiresAt
    );
    event PassportEventRecorded(
        bytes32 indexed passportId,
        bytes32 indexed eventType,
        address indexed actor,
        string locationCode,
        uint256 eventTimestamp,
        string payloadHash
    );
    event PassportOwnershipTransferred(
        bytes32 indexed passportId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 transferredAt
    );
    event PassportDeactivated(
        bytes32 indexed passportId,
        bytes32 indexed reasonCode,
        address indexed deactivatedBy,
        uint256 deactivatedAt
    );

    error PassportAlreadyExists(bytes32 passportId);
    error PassportNotFound(bytes32 passportId);
    error Unauthorized();
    error InvalidOwner();
    error PassportAlreadyInactive(bytes32 passportId);

    function createPassport(
        bytes32 passportId,
        string calldata batchId,
        string calldata product,
        string calldata origin
    ) external {
        if (passports[passportId].createdAt != 0) {
            revert PassportAlreadyExists(passportId);
        }

        passports[passportId] = Passport({
            batchId: batchId,
            product: product,
            origin: origin,
            metadataHash: "",
            owner: msg.sender,
            active: true,
            createdAt: block.timestamp
        });

        emit PassportCreated(passportId, batchId, msg.sender, product, origin, block.timestamp);
    }

    function setPassportStatus(bytes32 passportId, bool active) external {
        Passport storage passport = passports[passportId];
        if (passport.createdAt == 0) {
            revert PassportNotFound(passportId);
        }
        if (passport.owner != msg.sender) {
            revert Unauthorized();
        }

        bool previousActive = passport.active;
        passport.active = active;
        emit PassportStatusUpdated(passportId, msg.sender, previousActive, active, block.timestamp);
    }

    function updatePassportMetadata(bytes32 passportId, bytes32 fieldMask, string calldata metadataHash) external {
        Passport storage passport = passports[passportId];
        if (passport.createdAt == 0) {
            revert PassportNotFound(passportId);
        }
        if (passport.owner != msg.sender) {
            revert Unauthorized();
        }

        passport.metadataHash = metadataHash;
        emit PassportMetadataUpdated(passportId, fieldMask, msg.sender, metadataHash, block.timestamp);
    }

    function attachPassportCertification(
        bytes32 passportId,
        bytes32 certType,
        string calldata certificationHash,
        uint256 issuedAt,
        uint256 expiresAt
    ) external {
        Passport storage passport = passports[passportId];
        if (passport.createdAt == 0) {
            revert PassportNotFound(passportId);
        }
        if (passport.owner != msg.sender) {
            revert Unauthorized();
        }

        emit PassportCertificationAttached(passportId, certType, msg.sender, certificationHash, issuedAt, expiresAt);
    }

    function recordPassportEvent(
        bytes32 passportId,
        bytes32 eventType,
        address actor,
        string calldata locationCode,
        uint256 eventTimestamp,
        string calldata payloadHash
    ) external {
        Passport storage passport = passports[passportId];
        if (passport.createdAt == 0) {
            revert PassportNotFound(passportId);
        }
        if (passport.owner != msg.sender) {
            revert Unauthorized();
        }

        emit PassportEventRecorded(passportId, eventType, actor, locationCode, eventTimestamp, payloadHash);
    }

    function transferPassportOwnership(bytes32 passportId, address newOwner) external {
        Passport storage passport = passports[passportId];
        if (passport.createdAt == 0) {
            revert PassportNotFound(passportId);
        }
        if (passport.owner != msg.sender) {
            revert Unauthorized();
        }
        if (newOwner == address(0)) {
            revert InvalidOwner();
        }

        address previousOwner = passport.owner;
        passport.owner = newOwner;
        emit PassportOwnershipTransferred(passportId, previousOwner, newOwner, block.timestamp);
    }

    function deactivatePassport(bytes32 passportId, bytes32 reasonCode) external {
        Passport storage passport = passports[passportId];
        if (passport.createdAt == 0) {
            revert PassportNotFound(passportId);
        }
        if (passport.owner != msg.sender) {
            revert Unauthorized();
        }
        if (!passport.active) {
            revert PassportAlreadyInactive(passportId);
        }

        passport.active = false;
        emit PassportStatusUpdated(passportId, msg.sender, true, false, block.timestamp);
        emit PassportDeactivated(passportId, reasonCode, msg.sender, block.timestamp);
    }

    function getPassport(bytes32 passportId) external view returns (Passport memory) {
        Passport memory passport = passports[passportId];
        if (passport.createdAt == 0) {
            revert PassportNotFound(passportId);
        }

        return passport;
    }
}
