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
import com.medicalsplants.util.UlidGenerator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final PlantRepository plantRepository;
    private final UserRepository userRepository;
    private final UlidGenerator ulidGenerator;

    public ReceiptService(ReceiptRepository receiptRepository,
            PlantRepository plantRepository,
            UserRepository userRepository,
            UlidGenerator ulidGenerator) {
        this.receiptRepository = receiptRepository;
        this.plantRepository = plantRepository;
        this.userRepository = userRepository;
        this.ulidGenerator = ulidGenerator;
    }

    @Transactional(readOnly = true)
    public Page<Receipt> getPublishedReceipts(boolean canSeePremium, Pageable pageable) {
        return receiptRepository.findPublished(canSeePremium, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Receipt> getReceiptsByPlantId(String plantId, boolean canSeePremium, Pageable pageable) {
        return receiptRepository.findPublishedByPlantId(plantId, canSeePremium, pageable);
    }

    @Transactional(readOnly = true)
    public Receipt getReceiptById(String id, CustomUserDetails currentUser) {
        Receipt receipt = receiptRepository.findById(id)
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
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", authorId));

        Receipt receipt = new Receipt();
        receipt.setId(ulidGenerator.generate());
        receipt.setTitle(title);
        receipt.setType(type);
        receipt.setDescription(description);
        receipt.setIsPremium(isPremium != null ? isPremium : false);
        receipt.setStatus(ReceiptStatus.DRAFT);
        receipt.setAuthor(author);

        if (plantIds != null && !plantIds.isEmpty()) {
            for (String plantId : plantIds) {
                Plant plant = plantRepository.findById(plantId)
                        .orElseThrow(() -> new ResourceNotFoundException("Plant", "id", plantId));
                receipt.getPlants().add(plant);
            }
        }

        return receiptRepository.save(receipt);
    }

    @Transactional
    public Receipt updateReceipt(String id, String title, ReceiptType type,
            String description, Boolean isPremium, CustomUserDetails currentUser) {
        Receipt receipt = receiptRepository.findById(id)
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
        Receipt receipt = receiptRepository.findById(id)
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
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt", "id", id));

        if (receipt.getStatus() != ReceiptStatus.PENDING) {
            throw new BadRequestException("Only pending recipes can be approved");
        }

        receipt.setStatus(ReceiptStatus.PUBLISHED);
        return receiptRepository.save(receipt);
    }

    @Transactional
    public Receipt rejectReceipt(String id) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt", "id", id));

        if (receipt.getStatus() != ReceiptStatus.PENDING) {
            throw new BadRequestException("Only pending recipes can be rejected");
        }

        receipt.setStatus(ReceiptStatus.REJECTED);
        return receiptRepository.save(receipt);
    }

    @Transactional
    public void deleteReceipt(String id, CustomUserDetails currentUser) {
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt", "id", id));

        boolean isOwner = receipt.getAuthor() != null
                && receipt.getAuthor().getId().equals(currentUser.getId());
        if (!isOwner && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only delete your own recipes");
        }

        receiptRepository.delete(receipt);
    }
}
