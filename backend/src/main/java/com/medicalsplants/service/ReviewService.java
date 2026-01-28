package com.medicalsplants.service;

import com.medicalsplants.exception.ForbiddenException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.exception.BadRequestException;
import com.medicalsplants.model.entity.Receipt;
import com.medicalsplants.model.entity.Review;
import com.medicalsplants.model.entity.User;
import com.medicalsplants.repository.ReceiptRepository;
import com.medicalsplants.repository.ReviewRepository;
import com.medicalsplants.repository.UserRepository;
import com.medicalsplants.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ReviewService {

    public ReviewService(ReviewRepository reviewRepository, ReceiptRepository receiptRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.receiptRepository = receiptRepository;
        this.userRepository = userRepository;
    }

    private final ReviewRepository reviewRepository;
    private final ReceiptRepository receiptRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Review> getReviewsByReceiptId(String receiptId) {
        UUID uuid = UUID.fromString(receiptId);
        return reviewRepository.findByReceiptIdAndNotDeleted(uuid);
    }

    @Transactional(readOnly = true)
    public Review getReviewById(String id) {
        UUID uuid = UUID.fromString(id);
        return reviewRepository.findByIdAndNotDeleted(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));
    }

    @Transactional(readOnly = true)
    public Page<Review> getReviewsByUserId(String userId, Pageable pageable) {
        UUID uuid = UUID.fromString(userId);
        return reviewRepository.findBySenderIdAndNotDeleted(uuid, pageable);
    }

    @Transactional(readOnly = true)
    public long getReviewCountByReceiptId(String receiptId) {
        UUID uuid = UUID.fromString(receiptId);
        return reviewRepository.countByReceiptId(uuid);
    }

    @Transactional
    public Review createReview(String receiptId, String content, String parentReviewId, String senderId) {
        UUID receiptUuid = UUID.fromString(receiptId);
        if (receiptUuid == null) {
            throw new BadRequestException("Receipt id cannot be null");
        }
        Receipt receipt = receiptRepository.findById(receiptUuid)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt", "id", receiptId));

        UUID senderUuid = UUID.fromString(senderId);
        if (senderUuid == null) {
            throw new BadRequestException("Sender id cannot be null");
        }
        User sender = userRepository.findById(senderUuid)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", senderId));

        Review review = new Review();
        review.setId(java.util.UUID.randomUUID());
        review.setContent(content);
        review.setReceipt(receipt);
        review.setSender(sender);

        if (parentReviewId != null && !parentReviewId.isBlank()) {
            UUID parentUuid = UUID.fromString(parentReviewId);
            if (parentUuid == null) {
                throw new BadRequestException("Parent review id cannot be null");
            }
            Review parentReview = reviewRepository.findByIdAndNotDeleted(parentUuid)
                    .orElseThrow(() -> new ResourceNotFoundException("Review", "id", parentReviewId));
            review.setParentReview(parentReview);
        }

        return reviewRepository.save(review);
    }

    @Transactional
    public Review updateReview(String id, String content, CustomUserDetails currentUser) {
        Review review = getReviewById(id);

        if (!review.getSender().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only edit your own reviews");
        }

        review.setContent(content);
        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(String id, CustomUserDetails currentUser) {
        Review review = getReviewById(id);

        if (!review.getSender().getId().equals(currentUser.getId()) && !currentUser.isAdmin()) {
            throw new ForbiddenException("You can only delete your own reviews");
        }

        review.softDelete();
        reviewRepository.save(review);
    }
}
