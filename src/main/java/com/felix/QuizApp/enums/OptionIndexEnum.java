package com.felix.QuizApp.enums;

public enum OptionIndexEnum {
    A(0), B(1), C(2), D(3);

    private final int index;

    OptionIndexEnum(int index) {
        this.index = index;
    }

    public int getIndex() {
        return index;
    }

    public static OptionIndexEnum fromIndex(int index) {
        for (OptionIndexEnum value : OptionIndexEnum.values()) {
            if (value.getIndex() == index) {
                return value;
            }
        }
        throw new IllegalArgumentException("Invalid option index: " + index);
    }
}

