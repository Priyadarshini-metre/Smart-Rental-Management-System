package com.smartrentalmanagement.service.impl;

import com.smartrentalmanagement.dto.DashboardStatsDTO;
import com.smartrentalmanagement.dto.MonthlyRevenueDTO;
import com.smartrentalmanagement.repository.PropertyRepository;
import com.smartrentalmanagement.repository.TenantRepository;
import com.smartrentalmanagement.repository.PaymentRepository;
import com.smartrentalmanagement.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        long totalProperties = propertyRepository.count();
        long totalTenants = tenantRepository.count();
        long occupiedProperties = propertyRepository.countByStatus("OCCUPIED");
        long vacantProperties = propertyRepository.countByStatus("VACANT");
        
        Double totalRev = paymentRepository.sumTotalRevenue();
        double totalRevenue = totalRev != null ? totalRev : 0.0;

        List<Object[]> rawMonthly = paymentRepository.getMonthlyRevenue();
        List<MonthlyRevenueDTO> monthlyRevenue = new ArrayList<>();

        for (Object[] row : rawMonthly) {
            if (row != null && row.length >= 3) {
                int monthVal = ((Number) row[0]).intValue();
                int yearVal = ((Number) row[1]).intValue();
                double sumVal = ((Number) row[2]).doubleValue();

                String monthName = Month.of(monthVal).getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + yearVal;
                monthlyRevenue.add(new MonthlyRevenueDTO(monthName, sumVal));
            }
        }

        return DashboardStatsDTO.builder()
                .totalProperties(totalProperties)
                .totalTenants(totalTenants)
                .occupiedProperties(occupiedProperties)
                .vacantProperties(vacantProperties)
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .build();
    }
}
