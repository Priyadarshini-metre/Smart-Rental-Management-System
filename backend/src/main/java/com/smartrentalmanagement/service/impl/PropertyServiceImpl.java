package com.smartrentalmanagement.service.impl;

import com.smartrentalmanagement.dto.PropertyDTO;
import com.smartrentalmanagement.entity.Property;
import com.smartrentalmanagement.exception.ResourceNotFoundException;
import com.smartrentalmanagement.repository.PropertyRepository;
import com.smartrentalmanagement.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PropertyServiceImpl implements PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<PropertyDTO> getAllProperties(String location, Double minRent, Double maxRent, String status, String type,
                                             int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Property> properties = propertyRepository.searchProperties(location, minRent, maxRent, status, type, pageable);
        return properties.map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyDTO getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
        return mapToDTO(property);
    }

    @Override
    @Transactional
    public PropertyDTO createProperty(PropertyDTO propertyDTO) {
        Property property = mapToEntity(propertyDTO);
        property.setStatus("VACANT"); // Initial status
        Property savedProperty = propertyRepository.save(property);
        return mapToDTO(savedProperty);
    }

    @Override
    @Transactional
    public PropertyDTO updateProperty(Long id, PropertyDTO propertyDTO) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        property.setName(propertyDTO.getName());
        property.setAddress(propertyDTO.getAddress());
        property.setLocation(propertyDTO.getLocation());
        property.setDescription(propertyDTO.getDescription());
        property.setType(propertyDTO.getType());
        property.setRentAmount(propertyDTO.getRentAmount());
        if (propertyDTO.getStatus() != null) {
            property.setStatus(propertyDTO.getStatus());
        }
        property.setImageUrl(propertyDTO.getImageUrl());

        Property updatedProperty = propertyRepository.save(property);
        return mapToDTO(updatedProperty);
    }

    @Override
    @Transactional
    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
        propertyRepository.delete(property);
    }

    private PropertyDTO mapToDTO(Property property) {
        return PropertyDTO.builder()
                .id(property.getId())
                .name(property.getName())
                .address(property.getAddress())
                .location(property.getLocation())
                .description(property.getDescription())
                .type(property.getType())
                .rentAmount(property.getRentAmount())
                .status(property.getStatus())
                .imageUrl(property.getImageUrl())
                .build();
    }

    private Property mapToEntity(PropertyDTO dto) {
        return Property.builder()
                .id(dto.getId())
                .name(dto.getName())
                .address(dto.getAddress())
                .location(dto.getLocation())
                .description(dto.getDescription())
                .type(dto.getType())
                .rentAmount(dto.getRentAmount())
                .status(dto.getStatus())
                .imageUrl(dto.getImageUrl())
                .build();
    }
}
