package com.util.factory;

import java.util.Scanner;

public class IOFactory {
    
    private static Scanner scanner;

    public static Scanner getSysInScanner() {
        if (scanner == null) {
            scanner = new Scanner(System.in);
        }
        return scanner;
    }
}
