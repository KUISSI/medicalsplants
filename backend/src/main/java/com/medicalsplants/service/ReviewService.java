package com.medicalsplants.service;

import com.medicalsplants.exception.ForbiddenException;
import com.medicalsplants.exception.ResourceNotFoundException;
import com.medicalsplants.model.entity.Receipt;
import com.medicalsplants.model.entity.Review;
import com.medicalsplants.model.entity.User;
import com.medicalsplants.repository.ReceiptRepository;
import com.medicalsplants.repository.ReviewRepository;
import com.medicalsplants.repository.UserRepository;
import com.medicalsplants.security.CustomUserDetails;
import com.medicalsplants.util.UlidGenerator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReceiptRepository receiptRepository;
    private final UserRepository userRepository;
    private final UlidGenerator ulidGenerator;

    public ReviewService(ReviewRepository reviewRepository,
            ReceiptRepository receiptRepository,
            UserRepository userRepository,
            UlidGenerator ulidGenerator) {
        this.reviewRepository = reviewRepository;
        this.receiptRepository = receiptRepository;
        this.userRepository = userRepository;
        this.ulidGenerator = ulidGenerator;
    }

    @Transactional(readOnly = true)
    public List<Review> getReviewsByReceiptId(String receiptId) {
        return reviewRepository.findByReceiptIdAndNotDeleted(receiptId);
    }

    @Transactional(readOnly = true)
    public Review getReviewById(String id) {
        return reviewRepository.findByIdAndNotDeleted(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));
    }

    @Transactional(readOnly = true)
    public Page<Review> getReviewsByUserId(String userId, Pageable pageable) {
        return reviewRepository.findBySenderIdAndNotDeleted(userId, pageable);
    }

    @Transactional(readOnly = true)
    public long getReviewCountByReceiptId(String receiptId) {
        return reviewRepository.countByReceiptId(receiptId);
    }

    @Transactional
    public Review createReview(String receiptId, String content, String parentReviewId, String senderId) {
        Receipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt", "id", receiptId));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", senderId));

        Review review = new Review();
        review.setId(ulidGenerator.generate());
        review.setContent(content);
        review.setReceipt(receipt);
        review.setSender(sender);

        if (parentReviewId != null && !parentReviewId.isBlank()) {
            Review parentReview = reviewRepository.findByIdAndNotDeleted(parentReviewId)
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
