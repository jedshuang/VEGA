    package com.srv.command.jcommander.converter;

import com.beust.jcommander.IStringConverter;

import java.io.FileNotFoundException;
import java.io.FileReader;

public class FileReaderConverter implements IStringConverter<FileReader> {
    @Override
    public FileReader convert(String value){
        try {
            return new FileReader(value);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return null;
        }
    }
}
