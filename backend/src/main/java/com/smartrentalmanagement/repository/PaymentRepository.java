package com.smartrentalmanagement.repository;

import com.smartrentalmanagement.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBookingId(Long bookingId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'PAID'")
    Double sumTotalRevenue();

    @Query("SELECT MONTH(p.paymentDate), YEAR(p.paymentDate), SUM(p.amount) " +
            "FROM Payment p " +
            "WHERE p.status = 'PAID' " +
            "GROUP BY YEAR(p.paymentDate), MONTH(p.paymentDate) " +
            "ORDER BY YEAR(p.paymentDate) ASC, MONTH(p.paymentDate) ASC")
    List<Object[]> getMonthlyRevenue();
}
