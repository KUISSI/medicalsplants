package com.medicalsplants.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class InstructionRequest {

    @NotNull(message = "Step number is required")
    private Integer step;

    @NotBlank(message = "Instruction description is required")
    private String description;

    public InstructionRequest() {
    }

    public InstructionRequest(Integer step, String description) {
        this.step = step;
        this.description = description;
    }

    public Integer getStep() {
        return step;
    }

    public void setStep(Integer step) {
        this.step = step;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
