package com.medicalsplants.model.dto.response;

public class InstructionResponse {

    private Integer step;
    private String description;

    public InstructionResponse() {
    }

    public InstructionResponse(Integer step, String description) {
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
