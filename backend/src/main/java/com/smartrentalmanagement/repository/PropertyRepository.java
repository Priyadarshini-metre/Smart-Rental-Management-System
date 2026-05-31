package com.smartrentalmanagement.repository;

import com.smartrentalmanagement.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    @Query("SELECT p FROM Property p WHERE " +
            "(:location IS NULL OR :location = '' OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:minRent IS NULL OR p.rentAmount >= :minRent) AND " +
            "(:maxRent IS NULL OR p.rentAmount <= :maxRent) AND " +
            "(:status IS NULL OR :status = '' OR p.status = :status) AND " +
            "(:type IS NULL OR :type = '' OR p.type = :type)")
    Page<Property> searchProperties(@Param("location") String location,
                                    @Param("minRent") Double minRent,
                                    @Param("maxRent") Double maxRent,
                                    @Param("status") String status,
                                    @Param("type") String type,
                                    Pageable pageable);

    long countByStatus(String status);
}
