package com.smartrentalmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class SmartRentalManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartRentalManagementApplication.class, args);
    }
}
