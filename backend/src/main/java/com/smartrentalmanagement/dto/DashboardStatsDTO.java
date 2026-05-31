package com.smartrentalmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private long totalProperties;
    private long totalTenants;
    private long occupiedProperties;
    private long vacantProperties;
    private double totalRevenue;
    private List<MonthlyRevenueDTO> monthlyRevenue;
}
