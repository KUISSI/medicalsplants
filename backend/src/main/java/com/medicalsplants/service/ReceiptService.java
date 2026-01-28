package com.medicalsplants.service;

import com.medicalsplants.exception.BadRequestException;
import com.medicalsplants.exception.ForbiddenException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.model.entity.Plant;
import com.medicalsplants.model.entity.Receipt;
import com.medicalsplants.model.entity.User;
import com.medicalsplants.model.enums.ReceiptStatus;
import com.medicalsplants.model.enums.ReceiptType;
import com.medicalsplants.repository.PlantRepository;
import com.medicalsplants.repository.ReceiptRepository;
import com.medicalsplants.repository.UserRepository;
import com.medicalsplants.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service

public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final PlantRepository plantRepository;
    private final UserRepository userRepository;

    public ReceiptService(ReceiptRepository receiptRepository, PlantRepository plantRepository, UserRepository userRepository) {
        this.receiptRepository = receiptRepository;
        this.plantRepository = plantRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<Receipt> getPublishedReceipts(boolean canSeePremium, Pageable pageable) {
        return receiptRepository.findPublished(canSeePremium, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Receipt> getReceiptsByPlantId(String plantId, boolean canSeePremium, Pageable pageable) {
        UUID uuid = UUID.fromString(plantId);
        return receiptRepository.findPublishedByPlantId(uuid, canSeePremium, pageable);
    }

    @Transactional(readOnly = true)
    public Receipt getReceiptById(String id, CustomUserDetails currentUser) {

        UUID uuid = UUID.fromString(id);
        if (uuid == null) {
            throw new BadRequestException("Receipt id cannot be null");
        }
        Receipt receipt = receiptRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt", "id", id));

        // Check access
        if (receipt.getStatus() != ReceiptStatus.PUBLISHED) {
            if (currentUser == null) {
                throw new ForbiddenException("This recipe is not published");
            }
            boolean isOwner = receipt.getAuthor() != null
                    && receipt.getAuthor().getId().equals(currentUser.getId());
            if (!isOwner && !currentUser.isAdmin()) {
                throw new ForbiddenException("You don't have access to this recipe");
            }
        }

        if (receipt.getIsPremium() && currentUser != null && !currentUser.isPremium()) {
            throw new ForbiddenException("This is a premium recipe.  Please upgrade your account.");
        }

        return receipt;
    }

    @Transactional(readOnly = true)
    public List<Receipt> getPendingReceipts() {
        return receiptRepository.findPendingReceipts();
    }

    @Transactional
    public Receipt createReceipt(String title, ReceiptType type, String description,
            Boolean isPremium, Set<String> plantIds, String authorId) {

        UUID authorUuid = UUID.fromString(authorId);
        if (authorUuid == null) {
            throw new BadRequestException("Author id cannot be null");
        }
        User author = userRepository.findById(authorUuid)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));

        Receipt receipt = new Receipt();
        receipt.setId(java.util.UUID.randomUUID());
        receipt.setTitle(title);
        receipt.setType(type);
        receipt.setDescription(description);
        receipt.setIsPremium(isPremium != null ? isPremium : false);
        receipt.setStatus(ReceiptStatus.DRAFT);
        receipt.setAuthor(author);

        if (plantIds != null && !plantIds.isEmpty()) {
            for (String plantId : plantIds) {
                UUID plantUuid = UUID.fromString(plantId);
                if (plantUuid == null) {
                    throw new BadRequestException("Plant id cannot be null");
                }
                Plant plant = plantRepository.findById(plantUuid)
                        .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", plantId));
                receipt.getPlants().add(plant);
            }
        }

        return receiptRepository.save(receipt);
    }

    @Transactional
    public Receipt updateReceipt(String id, String title, ReceiptType type,
            String description, Boolean isPremium, CustomUserDetails currentUser) {

        UUID uuid = UUID.fromString(id);
        if (uuid == null) {
            throw new BadRequestException("Receipt id cannot be null");
        }
        Receipt receipt = receiptRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt", "id", id));

        // Check ownership
        boolean isOwner = receipt.getAuthor() != null
                && receipt.getAuthor().getId().equals(currentUser.getId());
        if (!isOwner && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only edit your own recipes");
        }

        receipt.setTitle(title);
        receipt.setType(type);
        receipt.setDescription(description);
        if (isPremium != null) {
            receipt.setIsPremium(isPremium);
        }

        return receiptRepository.save(receipt);
    }

    @Transactional
    public Receipt submitForReview(String id, CustomUserDetails currentUser) {
        UUID uuid = java.util.Objects.requireNonNull(UUID.fromString(id), "Receipt id cannot be null");
        Receipt receipt = receiptRepository.findById(uuid)
            .orElseThrow(() -> new ResourceNotFoundException("Receipt", "id", id));

        boolean isOwner = receipt.getAuthor() != null
                && receipt.getAuthor().getId().equals(currentUser.getId());
        if (!isOwner) {
            throw new ForbiddenException("You can only submit your own recipes");
        }

        if (receipt.getStatus() != ReceiptStatus.DRAFT) {
            throw new BadRequestException("Only draft recipes can be submitted for review");
        }

        receipt.setStatus(ReceiptStatus.PENDING);
        return receiptRepository.save(receipt);
    }

    @Transactional
    public Receipt approveReceipt(String id) {
        UUID uuid = java.util.Objects.requireNonNull(UUID.fromString(id), "Receipt id cannot be null");
        Receipt receipt = receiptRepository.findById(uuid)
            .orElseThrow(() -> new ResourceNotFoundException("Receipt", "id", id));

        if (receipt.getStatus() != ReceiptStatus.PENDING) {
            throw new BadRequestException("Only pending recipes can be approved");
        }

        receipt.setStatus(ReceiptStatus.PUBLISHED);
        return receiptRepository.save(receipt);
    }

    @Transactional
    public Receipt rejectReceipt(String id) {
        UUID uuid = java.util.Objects.requireNonNull(UUID.fromString(id), "Receipt id cannot be null");
        Receipt receipt = receiptRepository.findById(uuid)
            .orElseThrow(() -> new ResourceNotFoundException("Receipt", "id", id));

        if (receipt.getStatus() != ReceiptStatus.PENDING) {
            throw new BadRequestException("Only pending recipes can be rejected");
        }

        receipt.setStatus(ReceiptStatus.REJECTED);
        return receiptRepository.save(receipt);
    }

    @Transactional
    public void deleteReceipt(String id, CustomUserDetails currentUser) {
        UUID uuid = java.util.Objects.requireNonNull(UUID.fromString(id), "Receipt id cannot be null");
        Receipt receipt = receiptRepository.findById(uuid)
            .orElseThrow(() -> new ResourceNotFoundException("Receipt", "id", id));

        boolean isOwner = receipt.getAuthor() != null
                && receipt.getAuthor().getId().equals(currentUser.getId());
        if (!isOwner && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only delete your own recipes");
        }

        receiptRepository.delete(receipt);
    }
}
