package com.smartrentalmanagement.service;

import com.smartrentalmanagement.dto.PropertyDTO;
import org.springframework.data.domain.Page;

public interface PropertyService {
    Page<PropertyDTO> getAllProperties(String location, Double minRent, Double maxRent, String status, String type,
                                       int page, int size, String sortBy, String sortDir);
    PropertyDTO getPropertyById(Long id);
    PropertyDTO createProperty(PropertyDTO propertyDTO);
    PropertyDTO updateProperty(Long id, PropertyDTO propertyDTO);
    void deleteProperty(Long id);
}
